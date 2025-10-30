import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        product: {
          select: { name: true, categoryId: true, price: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!sales.length) {
      return NextResponse.json(
        { message: "Nenhuma venda registrada." },
        { status: 404 }
      );
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Relatório de Vendas");

    sheet.columns = [
      { header: "ID da Venda", key: "id", width: 20 },
      { header: "Produto", key: "product", width: 30 },
      { header: "Tamanho", key: "size", width: 10 },
      { header: "Quantidade", key: "quantity", width: 12 },
      { header: "Preço Unitário (R$)", key: "price", width: 18 },
      { header: "Total (R$)", key: "total", width: 15 },
      { header: "Data da Venda", key: "date", width: 20 },
    ];

    sales.forEach((sale) => {
      sheet.addRow({
        id: sale.id,
        product: sale.product?.name || "Produto removido",
        category: sale.product?.categoryId || "-",
        size: sale.size,
        quantity: sale.quantity,
        price: sale.price.toFixed(2),
        total: sale.total.toFixed(2),
        date: new Date(sale.createdAt).toLocaleString("pt-BR"),
      });
    });

    // Cabeçalho estilizado
    const header = sheet.getRow(1);
    header.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0072FF" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Resumo total de vendas
    const totalVendas = sales.reduce((acc, s) => acc + s.total, 0);
    const totalItens = sales.reduce((acc, s) => acc + s.quantity, 0);
    const resumoRow = sheet.addRow([]);
    sheet.addRow(["", "", "", "", "Total de Itens Vendidos:", totalItens]);
    sheet.addRow(["", "", "", "", "Valor Total Vendido (R$):", totalVendas.toFixed(2)]);

    resumoRow.commit();

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": "attachment; filename=relatorio_vendas.xlsx",
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar relatório de vendas:", error);
    return NextResponse.json(
      { error: "Erro ao gerar relatório de vendas." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
