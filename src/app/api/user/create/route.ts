import prisma from "@/lib/prisma";
import { createUserSchema } from "@/lib/validations/user";
import { hash } from "bcrypt";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = body.name;
    const email = body.email;
    const password = body.password;
    const confirmPassword = body.confirmPassword;

    const validatedUserInput = createUserSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validatedUserInput.success) {
      return NextResponse.json(
        {
          field: validatedUserInput.error.issues[0].path[0],
          message: validatedUserInput.error.issues[0].message,
        },
        {
          status: 400,
        }
      );
    }

    const verifyEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (verifyEmail) {
      return NextResponse.json(
        {
          field: "email",
          message: "Email já cadastrado!",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await hash(password, 10);

    const ret = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: newUserPassword, ...user } = ret;

    return NextResponse.json({
      user: user,
      message: "Usuário criado com sucesso!",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Algo deu errado",
      },
      {
        status: 500,
      }
    );
  }
}
