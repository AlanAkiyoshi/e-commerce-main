import { NextResponse, NextRequest } from "next/server";

import prisma from "@/lib/prisma";

import { sign } from "jsonwebtoken";
import { COOKIE_NAME } from "@/constants";

import { compare } from "bcrypt";
import { cookies } from "next/headers";

// var MAX_AGE = 60 * 60 * 24;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = body.email;
  const password = body.password;
  const isChecked = body.isChecked;

  const existAccount = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!existAccount) {
    return NextResponse.json(
      { message: "User not found" },
      {
        status: 401,
      }
    );
  }

  const isPasswordValid = await compare(password, existAccount.password);

  if (!isPasswordValid) {
    return NextResponse.json(
      { message: "User not found" },
      {
        status: 404,
      }
    );
  }

  const secret = process.env.JWT_SECRET || "";

  const token = sign(
    {
      email,
    },
    secret,
    {
      expiresIn: isChecked ? "30d" : "1d",
    }
  );

  cookies().set(COOKIE_NAME, token, {
    expires: isChecked
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  if (email === process.env.EMAIL_ADMIN) {
    return NextResponse.json({
      message: "Is Admin",
      status: 200,
    });
  }

  return NextResponse.json({
    message: "Success",
    status: 200,
  });
}
