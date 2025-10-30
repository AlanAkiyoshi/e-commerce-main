import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🧠 GET - listar todos os produtos
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        sizes: true,
        category: true,
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { message: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}

// 🧩 POST - criar novo produto
export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("📦 Dados recebidos no POST /api/products:", data);

    // 🔧 Categoria opcional
    let categoryId: string | null = null;

    if (data.categoryId) {
      // Tenta achar a categoria
      const categoryExists = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      // Se não existir, cria uma genérica
      if (!categoryExists) {
        const newCat = await prisma.category.upsert({
          where: { name: "Sem Categoria" },
          update: {},
          create: { name: "Sem Categoria" },
        });
        categoryId = newCat.id;
      } else {
        categoryId = data.categoryId;
      }
    } else {
      // Se não veio categoria, usa "Sem Categoria"
      const defaultCat = await prisma.category.upsert({
        where: { name: "Sem Categoria" },
        update: {},
        create: { name: "Sem Categoria" },
      });
      categoryId = defaultCat.id;
    }

    // 🔧 Normaliza dados de imagens e tamanhos
    const imagesData =
      data.images?.map((img: any) => ({
        url: img.url || img,
      })) || [];

    const sizesData =
      data.sizes?.map((s: any) => ({
        size: s.size || s.name, // aceita "name" ou "size"
        stock: s.stock || 0,
      })) || [];

    // 🧱 Cria o produto
    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        categoryId,
        images: { create: imagesData },
        sizes: { create: sizesData },
      },
      include: { images: true, sizes: true },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("❌ Erro ao criar produto:", error);
    return NextResponse.json(
      { message: "Erro ao criar produto" },
      { status: 500 }
    );
  }
}
