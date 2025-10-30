import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/logo.png";
import "./nav.css";

const Nav = () => {
  return (
    <nav className="nav-bar">
      <div className="nav-left">
        <Link href="/">
          <Image className="logo" src={logo} alt="Logo" />
        </Link>
      </div>

      <div className="nav-center"></div>

      <div className="nav-right">
        <Link href="/products/manage" className="admin-button">
          🛠 Administração
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
