import { useEffect, useState } from "react";
import { useLayout } from "../layouts/Layout";
import { useNavigate } from "react-router-dom";
import { useAlerta } from "../context/AlertaContext";
import PageModal from "../components/pageModal/PageModal";
import {
  Backdrop,
  Box,
  CircularProgress,
  Grid2,
  Typography,
} from "@mui/material";
import Botao from "../components/btn/Botao";
import CampoTexto from "../components/input/CampoTexto";
import { emailRegex } from "../utils/util";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import { cadastrar } from "../services/UsuarioService";

const CriarFuncionario = () => {
  const { setTitulo, setActions } = useLayout();

  useEffect(() => {
    setTitulo("");
    setActions(null);
  });

  const navigate = useNavigate();
  const alerta = useAlerta();

  const [loading, setLoading] = useState(false);

  const [dadosFuncionario, setDadosFuncionario] = useState({
    email: "",
    senha: "",
    tipoUsuario: 0,
    contato: {
      nome: "",
      celular: "",
      cpf: "",
      dataNascimento: "",
    },
  });

  const [erros, setErros] = useState([]);
  const [podeAvancar, setAvancar] = useState(false);

  const handleErros = (e) => {
    setErros((prevState) => ({
      ...prevState,
      [e.name]: e.value,
    }));
  };

  useEffect(() => {
    setAvancar(() => {
      const campos = Object.keys(erros);
      for (let i = 0; i < campos.length; i++) {
        if (erros[campos[i]]) {
          return true;
        }
      }

      return false;
    });
  }, [erros]);

  const handleDadosChange = (e, name) => {
    setDadosFuncionario({ ...dadosFuncionario, [name]: e.target.value });
  };

  const handleContatoChange = (e) => {
    const contatoNovo = dadosFuncionario.contato;
    contatoNovo[e.target.name] = e.target.value;

    setDadosFuncionario({ ...dadosFuncionario, contato: contatoNovo });
  };

  const handleDataNascimentoChange = (e) => {
    const contatoNovo = dadosFuncionario.contato;
    contatoNovo.dataNascimento = e?.toISOString()?.split("T")[0];

    setDadosFuncionario({ ...dadosFuncionario, contato: contatoNovo });
  };

  const handleAdicionar = () => {
    setLoading(true);

    setTimeout(async () => {
      try {
        const request = {
          ...dadosFuncionario,
          contato: {
            ...dadosFuncionario.contato,
            cpf: dadosFuncionario.contato.cpf.replace(/\D/g, ""),
            celular: dadosFuncionario.contato.celular.replace(/\D/g, ""),
          },
        };

        const response = await cadastrar(request);

        if (response.error) {
          alerta.error("Não foi possivel adicionar funcionário");
          return;
        }

        alerta.success("Cadastro realizado com sucesso");
        navigate("/funcionarios");
      } catch (err) {
        alerta.error("Não foi possivel adicionar funcionário");
        console.log("Erro: ", err);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <>
      <PageModal>
        <Backdrop
          open={loading}
          sx={(theme) => ({ zIndex: theme.zIndex.drawer + 2 })}
        >
          <CircularProgress />
        </Backdrop>
        <Typography variant="h4" component="h4">
          Adicionar Funcionário
        </Typography>
        <Box sx={{ mt: 1, mb: 3 }}>
          <Grid2
            mb={2}
            mt={6}
            display={"flex"}
            justifyContent={"center"}
            width="100%"
            size={12}
          >
            <Typography variant="h5" component="h5">
              Dados do Funcionário
            </Typography>
          </Grid2>
          <Grid2 container width="80%" margin="auto" columnSpacing={10}>
            <Grid2 width="80%" margin="auto" container columnSpacing={2}>
              <CampoTexto
                size={6}
                handleChange={handleContatoChange}
                value={dadosFuncionario.contato.nome}
                name="nome"
                label="Nome"
                handleErros={handleErros}
                required
              />
              <CampoTexto
                size={6}
                handleChange={handleDadosChange}
                value={dadosFuncionario.email}
                name="email"
                label="E-mail"
                regex={emailRegex}
                handleErros={handleErros}
                required
              />
              <CampoTexto
                size={6}
                handleChange={handleDadosChange}
                value={dadosFuncionario.senha}
                name="senha"
                label="Senha"
                type="password"
                handleErros={handleErros}
                required
              />
              <CampoTexto
                size={6}
                handleChange={handleContatoChange}
                value={dadosFuncionario.contato.celular}
                name="celular"
                label="Celular"
                mascara="celular"
                handleErros={handleErros}
                required
              />
              <CampoTexto
                size={6}
                handleChange={handleContatoChange}
                value={dadosFuncionario.contato.cpf}
                name="cpf"
                mascara="cpf"
                label="CPF"
                handleErros={handleErros}
                required
              />
              <Grid2 size={6} item>
                <DatePicker
                  onChange={handleDataNascimentoChange}
                  slotProps={{ textField: { fullWidth: true } }}
                  sx={{ mt: 2 }}
                />
              </Grid2>
            </Grid2>
          </Grid2>
        </Box>
        <Box
          sx={{
            mt: "auto",
            alignSelf: "center",
            display: "flex",
            gap: 1,
            width: "40%",
          }}
        >
          <Botao
            onClick={() => navigate(-1)}
            sx={{ width: "100%", minWidth: 100 }}
            variant={"contained"}
            color="primary"
            txt={"Cancelar"}
          />
          <Botao
            onClick={handleAdicionar}
            sx={{ width: "100%", minWidth: 100 }}
            disabled={!!podeAvancar}
            txt={"Adicionar"}
          />
        </Box>
      </PageModal>
    </>
  );
};

export default CriarFuncionario;
