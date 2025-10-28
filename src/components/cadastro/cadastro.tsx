// Cadastro.tsx
import { Button } from "@mui/material";
import axios from "axios";
import React, { ReactNode, useState, ChangeEvent, FormEvent } from "react";

interface CadastroProps {
  children: ReactNode;
  titulo?: string; // Nova propriedade para o título (opcional)

  buttonSucess?: boolean; // Nova propriedade para o aparecer o botão de  (opcional)
  buttonCancel?: boolean; // Nova propriedade para o título (opcional)

  oneinput?: boolean; // Nova propriedade para o título (opcional)
  twoinput?: boolean; // Nova propriedade para o título (opcional)
  threeinput?: boolean; // Nova propriedade para o título (opcional)
  fourinput?: boolean; // Nova propriedade para o título (opcional)

  disable?: string; // Desabilitar cadastros
}

const Cadastro: React.FC<CadastroProps> = ({
  children,
  titulo,
  buttonSucess,
  buttonCancel,
  oneinput,
  twoinput,
  threeinput,
  fourinput,
  disable,
}) => {
  const inputHeight = () => {
    if (oneinput) return "170px";
    if (twoinput) return "240px";
    if (threeinput) return "310px";
    if (fourinput) return "380px";
    return "60vh"; // Padrão caso nenhuma propriedade seja fornecida
  };

  const minInputHeight = () => {
    if (oneinput) return "61px";
    if (twoinput) return "122px";
    if (threeinput) return "183px";
    if (fourinput) return "244px";
    return "500px"; // Padrão caso nenhuma propriedade seja fornecida
  };

  const desabilitarOpasidade = () => {
    if (disable) return "0.5";
  };

  const desabilitarBotao = () => {
    if (disable) return true;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        height: "100%",
      }}
    >
      <div
        style={{
          width: "70vw",
          height: inputHeight(),
          minHeight: minInputHeight(),
          opacity: desabilitarOpasidade(),

          // border: "solid 1px black",
          borderRadius: "10px",
          boxShadow: "0px 0px 30px 0px rgba(0,0,0,0.2)",

          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            padding: "20px",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {titulo && <h2 style={{ fontWeight: "600" }}>{titulo}</h2>}
          <div style={{ width: "100%", height: "100%" }}>{children}</div>
        </div>
      </div>
      <div>
        {buttonCancel && (
          <Button
            variant="contained"
            color="error"
            style={{ marginRight: "20px", flexDirection: "row-reverse" }}
            disabled={desabilitarBotao()}
          >
            Cancelar
          </Button>
        )}
        {buttonSucess && (
          <Button
            variant="contained"
            color="success"
            type="submit"
            disabled={desabilitarBotao()}
          >
            Adicionar
          </Button>
        )}
      </div>
    </div>
  );
};

export default Cadastro;
