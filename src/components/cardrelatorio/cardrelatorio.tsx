import React from "react";
import "./cardrelatorio.css";

interface CardRelatorioProps {
  titulo?: string;
  qtdVendas?: number;
  qtdArrecadado?: number;
}

const CardRelatorio: React.FC<CardRelatorioProps> = ({
  titulo,
  qtdVendas,
  qtdArrecadado,
}) => {
  return (
    <div className="card">
      <div className="bg">
        <div style={{ marginLeft: "10px" }}>
          <h1>{titulo}</h1>
          <h3 style={{ marginTop: "25px" }}>
            Quantidade de vendas: {qtdVendas}
          </h3>
          <h3>Quantidade arrecadada: R$ {qtdArrecadado}</h3>
        </div>
      </div>
      <div className="blob"></div>
    </div>
  );
};

export default CardRelatorio;
