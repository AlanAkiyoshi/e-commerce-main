import prisma from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const productId = body.productId;

    const ret = await prisma.order.create({
      data: {},
    });

    if (!ret) {
      return NextResponse.json(
        {
          message: "Algo deu errado",
        },
        {
          status: 500,
        }
      );
    }

    const retOrder = await prisma.orderItem.create({
      data: {
        orderId: ret.id,
        productId: productId,
      },
    });

    return NextResponse.json(
      {
        message: "Compra realizada com sucesso!",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Algo deu errado" + error,
      },
      {
        status: 500,
      }
    );
  }
}
