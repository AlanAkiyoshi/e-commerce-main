import { COOKIE_NAME } from "@/constants";
import { verify_auth_admin } from "@/lib/admin/autenticado";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = cookies().get(COOKIE_NAME)?.value;

  if (verify_auth_admin(token)) {
    try {
      const body = await req.json();
      const name = body.name;
      const size = body.size;
      const price = parseFloat(
        body.preco.replace(/[^\d,.-]/g, "").replace(",", ".")
      );
      const category = body.category;
      const drop = body.drop;
      const url = body.url;

      // console.log("body", body);

      if (!name || !size || !price || !category || !url) {
        return NextResponse.json(
          {
            message: "Dados inválidos",
          },
          {
            status: 400,
          }
        );
      }

      let categoryObj = await prisma.category.findUnique({
        where: { name: category },
      });

      if (!categoryObj) {
        categoryObj = await prisma.category.create({
          data: { name: category },
        });
      }

      const product = await prisma.product.create({
        data: {
          name,
          price: price,
          size,
          category: { connect: { id: categoryObj.id } },
          NewDrop: { connect: { id: drop } },
        },
      });

      const image = await prisma.image.create({
        data: {
          url,
          product: { connect: { id: product.id } },
        },
      });

      // const ret = await prisma.product.create({
      //   data: {
      //     name,
      //     price,
      //   },
      // });

      // console.log("ret", product);

      return NextResponse.json(
        {
          message: "Produto criado com sucesso!",
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
  } else {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
}
