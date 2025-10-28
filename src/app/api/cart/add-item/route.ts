import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { productId, size, quantity } = await req.json();

    // (por enquanto sem autenticação)
    let cart = await prisma.cart.findFirst({
      where: { userId: null },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({ data: {} });
    }

    // verifica se o item já está no carrinho
    const existingItem = cart.items.find(
      (item) => item.productId === productId && item.size === size
    );

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          productId,
          size,
          quantity,
          cartId: cart.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao adicionar ao carrinho" }, { status: 500 });
  }
}
