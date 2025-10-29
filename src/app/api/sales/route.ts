import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { productId, size, quantity } = await req.json();

    if (!productId || !size || !quantity) {
      return NextResponse.json(
        { message: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }

    // 🔍 Buscar o produto e tamanho específico
    const sizeData = await prisma.size.findFirst({
      where: {
        productId,
        size,
      },
    });

    if (!sizeData) {
      return NextResponse.json(
        { message: "Tamanho não encontrado para este produto" },
        { status: 404 }
      );
    }

    // 🚫 Verificar se há estoque suficiente
    if (sizeData.stock < quantity) {
      return NextResponse.json(
        { message: `Estoque insuficiente. Disponível: ${sizeData.stock}` },
        { status: 400 }
      );
    }

    // 💰 Buscar informações do produto
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // 🧾 Criar a venda
    const total = product.price * quantity;

    await prisma.sale.create({
      data: {
        productId,
        size,
        quantity,
        price: product.price,
        total,
      },
    });

    // 📉 Atualizar o estoque do tamanho
    await prisma.size.update({
      where: { id: sizeData.id },
      data: {
        stock: sizeData.stock - quantity,
      },
    });

    return NextResponse.json({
      message: "Venda realizada com sucesso!",
      total,
      remainingStock: sizeData.stock - quantity,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao processar a venda" },
      { status: 500 }
    );
  }
}
