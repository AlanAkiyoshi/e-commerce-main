import Image from "next/image";
import Link from "next/link";

import { BiUser } from "react-icons/bi";
import { BsCart3 } from "react-icons/bs";

import logo from "../../assets/logo.png";
import "./nav.css";
import Button_Search from "../search/button_search";

const Nav = () => {
  return (
    <nav className="nav-bar">
      <div className="nav-left">
        <Link href="/">
          <Image className="logo" src={logo} alt="Logo" />
        </Link>
      </div>

      <div className="nav-center"></div> {/* Espaço vazio para separar esquerda/direita */}

      <div className="nav-right">
        <Button_Search />
        {/* Botão do carrinho atualizado */}
        <Link href="/cart" className="card-box">
          <BsCart3 className="cart" />
          Meu Carrinho
        </Link>
        <Link href="/login" className="link">
          <BiUser className="user" />
          <b>Entre</b> ou <b>Cadastre-se</b>
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
