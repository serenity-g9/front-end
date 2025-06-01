import React, { useEffect, useState } from "react";
import { getUsuarios } from "../utils/dataMockUtil";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import MudarVisualizacao from "../components/mudarVisualizacao/MudarVisualizacao";
import { fetchData } from "../services/DataService";
import { useAlerta } from "../context/AlertaContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
import VisibilityIcon from "@mui/icons-material/Visibility";

import dayjs from "dayjs";
import { useLayout } from "../layouts/Layout";
import Botao from "../components/btn/Botao";
import { ativar, desativar } from "../services/UsuarioService";

const Parceiros = () => {
  const { setTitulo, setActions } = useLayout();

  useEffect(() => {
    setTitulo("Parceiros");
    setActions(null);
  }, []);

  const alerta = useAlerta();

  const [usuarios, setUsuarios] = useState([]);
  const [usuariosData, setUsuariosData] = useState([]);
  const [nomePesquisado, setNomePesquisado] = useState("");
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  const handleSearchChange = (e) => {
    setNomePesquisado(e.target.value);
  };

  useEffect(() => {
    (async () => {
      const response = await fetchData("usuarios");
      console.log("oi");
      if (response.error) {
        alerta.error("Não foi possível buscar usuários");
        return;
      }

      setUsuariosData(response);
    })();
  }, [setUsuariosData, alerta]);

  useEffect(() => {
    const a = status === "desativado";

    setUsuarios(
      usuariosData.filter(
        (user) =>
          user.ativo !== a &&
          user.contato.nome.toLowerCase().includes(nomePesquisado.toLowerCase())
      )
    );
  }, [setUsuarios, nomePesquisado, usuariosData, status]);

  const filtros = [
    { id: "ativo", value: "Ativos", isDefault: true },
    { id: "desativado", value: "Desativados" },
  ];

  return (
    <>
      <MudarVisualizacao
        setFiltroStatus={() => {}}
        handleSearchChange={handleSearchChange}
        opcoesFiltro={filtros}
        nomePesquisado={""}
        noViewChange={true}
        setNomePesquisado={setNomePesquisado}
      />
      <Grid mt={4} container spacing={3}>
        {usuarios &&
          usuarios.map((usuario, index) => {
            return (
              <Grid
                item
                size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
                key={index}
              >
                <CardUsuario user={usuario} />
              </Grid>
            );
          })}
      </Grid>
    </>
  );
};

const CardUsuario = ({ user }) => {
  const navigate = useNavigate();

  const alerta = useAlerta();
  const { toggleDialog, setDialogAction, setDialogContent } = useLayout();

  const handleRemover = () => {
    setDialogAction(() => async () => {
      const response = await desativar(user.id);

      if (response.error) {
        alerta.error("Erro ao desativar " + user.contato.nome, "error");
        return;
      }

      alerta.success(`Usuário ${user.contato.nome} desativado com sucesso`);
    });

    setDialogContent({
      title: "Deseja excluir?",
      body: (
        <>
          O usuário {user.contato.nome} será desativado e não poderá mais
          realizar o acesso. Será possível reativá-lo no futuro.
        </>
      ),
    });
    toggleDialog();
  };

  const handleAtivar = () => {
    setDialogAction(() => async () => {
      const response = await ativar(user.id);

      if (response.error) {
        alerta.error("Erro ao ativar " + user.contato.nome, "error");
        return;
      }

      alerta.success(`Usuário ${user.contato.nome} ativado com sucesso`);
    });

    setDialogContent({
      title: "Deseja ativar?",
      body: <>O usuário {user.contato.nome} será ativado.</>,
    });
    toggleDialog();
  };

  return (
    <Card>
      <CardMedia
        component="img"
        height={140}
        image="https://dummyimage.com/800x800/eee/000"
      />
      <CardContent>
        <Box
          className="flexColumn"
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          <Typography gutterBottom variant="h6" component="div">
            {user.contato.nome}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {dayjs().diff(dayjs(user.contato.dataNascimento), "year")} anos
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {user.email}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {user?.contato?.celular
              ? user.contato.celular.replace(
                  /(\d{2})(\d{5})(\d{4})/,
                  "($1) $2-$3"
                )
              : "Número indisponível"}
          </Typography>
          {/* <Stack mt={2}>
              <Rating defaultValue={4} precision={0.5} readOnly />
            </Stack> */}
          <Box class="flexColumnCenter">
            {user?.ativo && (
              <>
                <Botao
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/usuarios/" + user.id)}
                  txt="Visualizar"
                  icon={<VisibilityIcon />}
                />
                <Botao
                  sx={{ mt: 1 }}
                  onClick={handleRemover}
                  color="primary"
                  variant="outlined"
                  txt="Desativar"
                  icon={<BlockIcon />}
                />
              </>
            )}
            {!user?.ativo && (
              <>
                <Botao
                  sx={{ mt: 2 }}
                  onClick={handleAtivar}
                  txt="Ativar"
                  color="primary"
                  icon={<CheckIcon />}
                />
              </>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Parceiros;
