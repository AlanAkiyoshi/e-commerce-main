"use client";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

import { FaBars, FaTimes } from "react-icons/fa";
import {
  BsCartPlus,
  BsTags,
  BsPerson,
  BsListCheck,
  BsGraphUp,
  BsGear,
  BsHouseDoor,
} from "react-icons/bs";

import Link from "next/link";
import { useState } from "react";

export default function BarNav(...props: any) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Sidebar
      collapsed={!isOpen}
      toggled
      backgroundColor="#1c2536"
      style={{
        background: "#000",
        borderRadius: "15px",
        height: "100vh",
        position: "absolute",
        left: "0px",
        bottom: "0px",
      }}
    >
      <Menu
        menuItemStyles={{
          button: {
            // the active class will be added automatically by react router
            // so we can use it to style the active menu item
            color: "#fff",
            background: "#1c2536",
            [`&.active`]: {
              backgroundColor: "#000",
              color: "#1c2536",
              borderRadius: "10px",
            },
            "&:hover": {
              backgroundColor: "#303c52",
            },
          },
        }}
      >
        <MenuItem
          onClick={toggleSidebar}
          style={{ marginBottom: "5rem" }}
          icon={isOpen ? <FaTimes /> : <FaBars />}
        ></MenuItem>

        <MenuItem
          icon={<BsHouseDoor />}
          component={<Link href="/dashboard" />}
          style={{ borderTop: "solid 1px black" }}
        ></MenuItem>

        <SubMenu label="Cadastros" icon={<BsListCheck />}>
          <MenuItem
            component={<Link href="/dashboard/produtos" />}
            icon={<BsCartPlus />}
          >
            Produtos
          </MenuItem>
          <MenuItem
            component={<Link href="/dashboard/drops" />}
            icon={<BsTags />}
          >
            {" "}
            New Drops
          </MenuItem>
        </SubMenu>

        <MenuItem
          icon={<BsGraphUp />}
          component={<Link href="/dashboard/relatorio" />}
        >
          Relatórios
        </MenuItem>

        <SubMenu label="Configurações" icon={<BsGear />}>
          <MenuItem
            component={<Link href="/dashboard/produtos" />}
            icon={<BsPerson />}
          >
            Usuário
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
}
