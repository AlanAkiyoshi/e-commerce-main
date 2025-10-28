"use client";

import Cadastro from "@/components/cadastro/cadastro";

import { useState } from "react";

import { Button, Grid } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Input from "@/components/shared/input/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/loader/loader";

import axios from "axios";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";

export default function Page() {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);

  const onFileChange = (files: any) => {
    if (!files) return;
    setFile(files[0]);
  };

  const notify = () => toast.error("Erro ao criar o drop! 😳");

  const onSubmit = async (event: any) => {
    event.preventDefault();
    try {
      if (!file) {
        console.error("Nenhum arquivo selecionado.");
        return;
      }

      setLoading(true);

      const storageRef = ref(storage, `images/${file.name}`);

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
            "/api/dashboard/newdrop",
            { name, url },
            {
              validateStatus: () => true,
            }
          );
          // console.log("response: ", res);

          setName("");
          setFile(undefined);

          if (res.status === 200) {
            toast.success("Drop criado com sucesso! 🔥");
            setLoading(false);
          } else {
            toast.error("Erro ao cadastrar drop! 😳");
          }
        }
      );
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      setName("");
      setFile(undefined);
    }
  };

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
          titulo="Cadastro de Novos Drops"
          buttonCancel
          buttonSucess
          oneinput
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
            <Grid xs={6} md={8} sm={8} item>
              <Input
                label="Nome do Drop"
                inputCadastro
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
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
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                Imagem do Drop
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
      <button onClick={notify}>notificação</button>
      <ToastContainer />
    </main>
  );
}
