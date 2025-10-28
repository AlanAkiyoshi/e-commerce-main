import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId: null },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0)
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });

    const total = cart.items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: "anonimo", // placeholder (pode ser substituído pelo user logado)
        total,
        items: {
          create: cart.items.map((i) => ({
            productId: i.productId,
            sizeId: i.size, // aqui depois pode ser adaptado
            quantity: i.quantity,
            price: i.product.price,
          })),
        },
      },
    });

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao finalizar pedido" }, { status: 500 });
  }
}
