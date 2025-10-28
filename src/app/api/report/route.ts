import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    const lines = orders.map((o) => {
      return `Produto: ${o.product.name} | Tamanho: ${o.size} | Quantidade: ${o.quantity} | Total: R$${o.totalPrice.toFixed(2)} | Data: ${o.createdAt.toLocaleString()}`;
    });

    const report = ["RELATÓRIO DE COMPRAS", "---------------------------", ...lines].join("\n");

    const filePath = path.join(process.cwd(), "public", "relatorio-compras.txt");
    fs.writeFileSync(filePath, report);

    return NextResponse.json({ success: true, url: "/relatorio-compras.txt" });
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    return NextResponse.json({ error: "Erro ao gerar relatório" }, { status: 500 });
  }
}
