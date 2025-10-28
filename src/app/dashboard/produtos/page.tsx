"use client";

import Cadastro from "@/components/cadastro/cadastro";
import Input from "@/components/shared/input/input";
import {
  Autocomplete,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  styled,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/loader/loader";

import { useEffect, useState } from "react";

import axios from "axios";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";
import { set } from "zod";
import { Prisma } from "@prisma/client";

export default function Page() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState<any>("");
  const [file, setFile] = useState<File>();
  const [preco, setPreco] = useState("");
  const [drop, setDrop] = useState<any>("");
  const [opcoes, setOpcoes] = useState<Prisma.NewDropGetPayload<{}>[]>();

  const [loading, setLoading] = useState(false);

  const onFileChange = (files: any) => {
    if (!files) return;
    setFile(files[0]);
  };

  const handlePrecoChange = (event: any) => {
    setPreco(event.target?.value);
  };

  const handleSizeChange = (event: any) => {
    setSize(event.target?.value);
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();
    try {
      if (!file) {
        console.error("Nenhum arquivo selecionado.");
        return;
      }

      setLoading(true);

      const storageRef = ref(storage, `products/${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Erro ao fazer upload da imagem:", error);
        },
        async () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          // console.log("File available at", url);

          const res = await axios.post(
            "/api/dashboard/products",
            { name, size, drop, category, preco, url },
            {
              validateStatus: () => true,
            }
          );
          // console.log("response: ", res);

          setName("");
          setCategory("");
          setSize("");
          setPreco("");
          setDrop("");
          setFile(undefined);

          if (res.status === 200) {
            toast.success("Produto adicionado com sucesso! 🔥");
            setLoading(false);
          } else {
            toast.error("Erro ao cadastrar o produto! 😳");
            setLoading(false);
          }
        }
      );
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      setName("");
      setCategory("");
      setSize("");
      setPreco("");
      setFile(undefined);
    }
  };

  useEffect(() => {
    async function getDrops() {
      const res = await axios.get("/api/dashboard/alldrops", {
        validateStatus: () => true,
      });
      setOpcoes(res.data);
    }

    getDrops();
  }, []);

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form onSubmit={onSubmit}>
        <Cadastro
          titulo="Cadastro de Produtos"
          buttonSucess
          buttonCancel
          twoinput
          disable={loading ? "true" : ""}
        >
          {loading && (
            <Loader
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            />
          )}
          <Grid container spacing={1}>
            <Grid
              xs={4}
              md={4}
              sm={8}
              sx={{
                width: { 300: "100%", 600: "50%" },
              }}
              item
            >
              <Input
                label="Nome do Produto"
                inputCadastro
                value={name}
                onChange={(e) => setName(e.target?.value)}
                disabled={loading}
              />
            </Grid>
            <Grid xs={3} md={4} sm={4} item>
              <Input
                value={preco}
                onChange={handlePrecoChange}
                label="Preço do Produto"
                inputCadastro
                disabled={loading}
              />
            </Grid>
            <Grid xs={4} md={4} sm={4} item style={{ marginTop: "-5px" }}>
              <label
                style={{
                  width: "100%",
                  minWidth: "140px",
                  paddingLeft: "5px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Categoria
              </label>
              <Select
                size="small"
                style={{ width: "100%" }}
                value={category}
                label="Age"
                onChange={(e) => setCategory(e.target?.value)}
                disabled={loading}
              >
                <MenuItem value={"Camiseta Oversized"}>
                  Camiseta Oversized
                </MenuItem>
                <MenuItem value={"Regata"}>Regata</MenuItem>
                <MenuItem value={"StreetWare"}>StreetWare</MenuItem>
              </Select>
            </Grid>
            <Grid xs={4} md={2} sm={4} item style={{ marginTop: "-5px" }}>
              <label
                style={{
                  width: "100%",
                  minWidth: "140px",
                  paddingLeft: "5px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Tamanho
              </label>
              <Select
                size="small"
                style={{ width: "100%" }}
                value={size}
                label="Age"
                onChange={handleSizeChange}
                disabled={loading}
              >
                <MenuItem value={"P"}>P</MenuItem>
                <MenuItem value={"PP"}>PP</MenuItem>
                <MenuItem value={"M"}>M</MenuItem>
                <MenuItem value={"G"}>G</MenuItem>
                <MenuItem value={"GG"}>GG</MenuItem>
              </Select>
            </Grid>
            <Grid xs={4} md={2} sm={4} item style={{ marginTop: "-5px" }}>
              <label
                style={{
                  width: "100%",
                  minWidth: "140px",
                  paddingLeft: "5px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Drop
              </label>
              <Select
                size="small"
                style={{ width: "100%" }}
                value={drop}
                label="Age"
                onChange={(e) => setDrop(e.target?.value)}
                disabled={loading}
              >
                {opcoes ? (
                  opcoes.map((opcao) => (
                    <MenuItem key={opcao.id} value={opcao.id}>
                      {opcao.name}
                    </MenuItem>
                  ))
                ) : (
                  <span>Sem itens</span>
                )}
              </Select>
            </Grid>
            <Grid
              xs={1}
              md={1}
              sm={2}
              item
              style={{
                display: "flex",

                marginLeft: "10px",
                flexDirection: "column",
              }}
            >
              <label
                style={{
                  width: "100%",
                  minWidth: "140px",
                  paddingLeft: "5px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Imagem do Produto
              </label>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                style={{
                  minWidth: "140px",
                }}
              >
                Upload
                <Input
                  type="file"
                  hidden
                  onChange={(files) => onFileChange(files.target.files)}
                  disabled={loading}
                />
              </Button>
            </Grid>
          </Grid>
        </Cadastro>
      </form>
      <ToastContainer />
    </main>
  );
}
