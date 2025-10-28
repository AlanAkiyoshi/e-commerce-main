import { verify, JwtPayload } from "jsonwebtoken";

export function verify_auth_admin(token: any) {
  // console.log("token", token);
  if (!token) {
    return false;
  }

  const secret = process.env.JWT_SECRET || "";

  let verify_auth: JwtPayload | string;

  try {
    verify_auth = verify(token, secret);
  } catch (error) {
    console.error("Erro na verificação do token:", error);
    return false;
  }

  if (typeof verify_auth === "string") {
    console.error("Token inválido");
    return false;
  }

  const email = verify_auth.email;

  // console.log("verify", verify_auth);

  if (email === process.env.EMAIL_ADMIN) {
    return true;
  } else {
    return false;
  }
}
