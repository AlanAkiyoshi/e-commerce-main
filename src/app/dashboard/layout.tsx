import { verify_auth_admin } from "@/lib/admin/autenticado";
import BarNav from "@/components/dashboard/navdashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME } from "@/constants";
// import { SideNav } from "@/components/navbardashboard/side-nav";
// import { useState } from "react";
// import { ThemeProvider } from "@mui/material/styles";
// import { createTheme } from "../../theme/index";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies().get(COOKIE_NAME)?.value;

  verify_auth_admin(cookieStore);
  // console.log("cookieStore", verify_auth_admin(cookieStore));
  // const theme = createTheme();

  if (verify_auth_admin(cookieStore)) {
    return (
      <html lang="pt-BR">
        <body
          style={{
            display: "flex",

            padding: "0",
            margin: "0",

            justifyContent: "center",
            alignItems: "center",

            height: "100vh",
            width: "100vw",

            backgroundColor: "#f8f9fa",
          }}
        >
          {/* <ThemeProvider theme={theme}> */}
          <BarNav />
          {/* <SideNav open /> */}
          {children}
          {/* </ThemeProvider> */}
        </body>
      </html>
    );
  } else {
    redirect("/");
  }
}
