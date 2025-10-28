"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

interface UserResponse {
  user: string | null;
  error: AxiosError | null;
}

export default function autenticadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [isSuccess, setIsSuccess] = useState<boolean>(false);
  /*   const router = useRouter();

  useEffect(() => {
    (async () => {
      const { user, error } = await getUser();

      if (error) {
        router.push("/login");
        return;
      }

      // setIsSuccess(true);
    })();
  }, [router]); */

  // if (!isSuccess) {
  //   return <p>loading...</p>;
  // }

  return <main>{children}</main>;
}

async function getUser(): Promise<UserResponse> {
  try {
    const { data } = await axios.get("/api/user/authenticated");

    return {
      user: data,
      error: null,
    };
  } catch (e) {
    const error = e as AxiosError;

    return {
      user: null,
      error,
    };
  }
}
