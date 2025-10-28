import { COOKIE_NAME } from "@/constants";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStorie = cookies();

  const token = cookieStorie.get(COOKIE_NAME);

  if (!token) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  const { value } = token;

  const secret = process.env.JWT_SECRET || "";

  try {
    verify(value, secret);

    const verify_auth = verify(value, secret);

    // console.log("verify", verify_auth);

    const response = {
      user: "Authenticated!",
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 400,
    });
  }
}
