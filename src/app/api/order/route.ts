import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { productId, size, quantity } = await req.json();

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { sizes: true },
    });

    if (!product) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });

    const sizeData = product.sizes.find((s) => s.size === size);
    if (!sizeData) return NextResponse.json({ error: "Tamanho inválido" }, { status: 400 });

    if (quantity > sizeData.stock)
      return NextResponse.json({ error: "Estoque insuficiente" }, { status: 400 });

    const totalPrice = product.price * quantity;

    // Cria o pedido
    const order = await prisma.order.create({
      data: {
        productId,
        size,
        quantity,
        totalPrice,
      },
    });

    // Atualiza o estoque
    await prisma.size.update({
      where: { id: sizeData.id },
      data: { stock: sizeData.stock - quantity },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
