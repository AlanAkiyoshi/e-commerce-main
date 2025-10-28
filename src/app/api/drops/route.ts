import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const ret = await prisma.newDrop.findUnique({
      where: {
        id: "aae6d070-c7e4-407e-841b-d91ff4fcea32",
      },
    });

    return NextResponse.json(
      {
        ret,
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
