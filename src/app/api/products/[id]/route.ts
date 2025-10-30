import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🔹 GET — Produto individual
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        sizes: true,
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}

// 🔹 PUT — Atualiza produto (inclusive tamanhos e imagens)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const { name, description, price, categoryId, images, sizes } = data;

    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
      include: { sizes: true, images: true },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Remove tamanhos e imagens antigos
    await prisma.size.deleteMany({ where: { productId: params.id } });
    await prisma.image.deleteMany({ where: { productId: params.id } });

    // Atualiza produto com novos dados
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId: categoryId || null,
        sizes: {
          create:
            sizes?.map((s: any) => ({
              size: s.size,
              stock: Number(s.stock) || 0,
            })) || [],
        },
        images: {
          create:
            images?.map((img: any) => ({
              url: img.url || img,
            })) || [],
        },
      },
      include: { images: true, sizes: true },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar produto" },
      { status: 500 }
    );
  }
}

// 🔹 DELETE — Apaga produto e seus vínculos
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Deleta dependências antes do produto
    await prisma.size.deleteMany({ where: { productId: params.id } });
    await prisma.image.deleteMany({ where: { productId: params.id } });
    await prisma.product.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Produto excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return NextResponse.json(
      { message: "Erro ao deletar produto" },
      { status: 500 }
    );
  }
}
