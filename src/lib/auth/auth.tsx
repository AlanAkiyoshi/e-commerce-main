import { COOKIE_NAME } from "@/constants";
import { verify, JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export function verify_auth() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME);

  // console.log("token", token);
  if (!token) {
    return false;
  }

  const { value } = token;
  const secret = process.env.JWT_SECRET || "";

  let verify_auth: JwtPayload | string;

  try {
    verify_auth = verify(value, secret);
  } catch (error) {
    console.error("Erro na verificação do token:", error);
    return false;
  }

  if (typeof verify_auth === "string") {
    console.error("Token inválido");
    return false;
  }

  return true;
}
