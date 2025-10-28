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
      const url = body.url;

      // console.log("body", body);

      const ret = await prisma.newDrop.create({
        data: {
          name,
          url,
        },
      });

      // console.log("ret", ret);

      return NextResponse.json(
        {
          message: "Drop criado com sucesso!",
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
