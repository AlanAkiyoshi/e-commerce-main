import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ ID fixo temporário para simular um carrinho de usuário logado
const STATIC_CART_ID = "global-cart-001";

export async function GET() {
  try {
    // Garante que o carrinho existe
    let cart = await prisma.cart.findUnique({
      where: { id: STATIC_CART_ID },
      include: {
        items: {
          include: {
            product: { include: { images: true, sizes: true } },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { id: STATIC_CART_ID },
        include: {
          items: {
            include: {
              product: { include: { images: true, sizes: true } },
            },
          },
        },
      });
    }

    // Adiciona maxQuantity baseado no estoque da tabela Size
    const items = cart.items.map((item) => {
      const productSize = item.product.sizes.find((s) => s.size === item.size);
      return {
        id: item.id,
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
        maxQuantity: productSize?.stock || 1,
        product: {
          name: item.product.name,
          price: item.product.price,
          images: item.product.images,
        },
      };
    });

    return NextResponse.json({ items });
  } catch (err) {
    console.error("❌ Erro ao buscar carrinho:", err);
    return NextResponse.json(
      { error: "Erro ao buscar carrinho" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { productId, size, quantity } = await req.json();

    if (!productId || !size) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Verifica se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { sizes: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    const sizeEntry = product.sizes.find((s) => s.size === size);
    if (!sizeEntry) {
      return NextResponse.json({ error: "Tamanho inválido" }, { status: 400 });
    }

    // Cria carrinho fixo se não existir
    let cart = await prisma.cart.findUnique({ where: { id: STATIC_CART_ID } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { id: STATIC_CART_ID } });
    }

    // Verifica se item já está no carrinho
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId, size },
    });

    const newQty = existingItem
      ? existingItem.quantity + (quantity || 1)
      : (quantity || 1);

    if (newQty > sizeEntry.stock) {
      return NextResponse.json(
        { error: "Estoque insuficiente" },
        { status: 400 }
      );
    }

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          productId,
          size,
          quantity: newQty,
          cartId: cart.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Erro ao adicionar item:", err);
    return NextResponse.json(
      { error: "Erro ao adicionar item ao carrinho" },
      { status: 500 }
    );
  }
}

