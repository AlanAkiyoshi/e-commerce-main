"use client";

import Link from "next/link";
import Image from "next/image";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import "./registrar.css";
import logo from "../../assets/logo.png";

import axios from "axios";
import Input from "../shared/input/input";
import { z } from "zod";
import { createUserSchema } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

type CreateUser = z.infer<typeof createUserSchema>;

export default function Registrar() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUser>({
    resolver: zodResolver(createUserSchema),
  });

  const { push } = useRouter();

  const [error, setError] = useState("");

  async function onSubmit(data: any) {
    setError("");
    const res = await axios.post("/api/user/create", data, {
      validateStatus: () => true,
    });

    if (res.status === 400) {
      setError(res.data.message);
    }
    if (res.status === 200) {
      push("/login");
    }
  }

  return (
    <main className="registrar-box">
      <Link href="/">
        <Image className="logo" src={logo} alt="Logo" />
      </Link>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="name-box">
          <Input
            type="text"
            placeholder="Nome"
            {...register("name")}
            error={!!errors.name}
          />
          {errors.name && (
            <p style={{ display: "flex", justifyContent: "center" }}>
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="email-box">
          <Input
            type="text"
            placeholder="Email"
            {...register("email")}
            error={!!errors.email || !!error}
          />
          {errors.email ? (
            <p style={{ display: "flex", justifyContent: "center" }}>
              {errors.email.message}
            </p>
          ) : (
            <p style={{ display: "flex", justifyContent: "center" }}>{error}</p>
          )}
        </div>
        <div className="password-box">
          <Input
            type="password"
            placeholder="Senha"
            {...register("password")}
            error={!!errors.password}
          />
          {errors.password && (
            <p style={{ display: "flex", justifyContent: "center" }}>
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="confirm-box">
          <Input
            type="password"
            placeholder="Confirme sua senha"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p style={{ display: "flex", justifyContent: "center" }}>
              As senhas não se coincidem
            </p>
          )}
        </div>
        <div className="box-buttons">
          <button className="login-button" type="submit">
            Cadastrar
          </button>
        </div>
      </form>
      <Link href="/login" className="back-button">
        Já possui uma conta ? Faça login
      </Link>
    </main>
  );
}
