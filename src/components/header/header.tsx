import Nav from "./nav";
import "./header.css";

const Header = () => {
  return (
    <header style={{ position: "relative", width: "100%", height: "50vh" }}>
      {/* Nav flutuante */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 10 }}>
        <Nav />
      </div>

      {/* Imagem de fundo */}
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url("https://images.unsplash.com/photo-1693743107371-ad6e933c7c28?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay escura */}
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)", // ajuste a opacidade se quiser mais claro ou escuro
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Aqui você pode colocar botão ou texto central */}
        </div>
      </div>
    </header>
  );
};

export default Header;
