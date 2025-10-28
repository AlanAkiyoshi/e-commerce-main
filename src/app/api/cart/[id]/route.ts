import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { quantity } = await request.json();
    const cartItem = await prisma.cartItem.findUnique({ where: { id: params.id } });

    if (!cartItem) return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });

    // Atualiza quantidade
    const updatedItem = await prisma.cartItem.update({
      where: { id: params.id },
      data: { quantity },
    });

    return NextResponse.json(updatedItem);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao atualizar item" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await prisma.cartItem.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Item removido" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao remover item" }, { status: 500 });
  }
}
