import React, { useEffect, useState } from "react";
import { getUsuarios } from "../utils/dataMockUtil";
import {
  Box,
  Card,
  IconButton,
  CardContent,
  CardMedia,
  Menu,
  Chip,
  MenuItem,
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CreateIcon from "@mui/icons-material/Create";
import dayjs from "dayjs";
import { useLayout } from "../layouts/Layout";
import Botao from "../components/btn/Botao";
import { ativar, desativar } from "../services/UsuarioService";
import { captalizarPrimeiraLetra } from "../utils/util";

const Parceiros = () => {
  const { setTitulo, setActions } = useLayout();

  useEffect(() => {
    setTitulo("Funcionários");
    setActions(null);
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const actions = [
      {
        label: "Adicionar",
        handleClick: () => navigate("/funcionarios/adicionar"),
        icon: <CreateIcon />,
      },
    ];

    setActions(actions);
  }, [setActions, navigate]);

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
      if (response.error) {
        alerta.error("Não foi possível buscar usuários");
        return;
      }

      console.log(response);

      setUsuariosData(response);
    })();
  }, [setUsuariosData, alerta]);

  useEffect(() => {
    setUsuarios(
      usuariosData.filter(
        (user) =>
          user.ativo !== (status === "desativado") &&
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

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

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
    handleMenuClose();
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
    handleMenuClose();
  };

  const idade = dayjs().diff(dayjs(user.contato.dataNascimento), "year");

  return (
    <Card>
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height={140}
          image={user.imagem?.url || "https://dummyimage.com/800x800/eee/000"}
        />
        {!user.ativo && (
          <Chip
            label="Inativo"
            size="small"
            color="primary"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              color: "white",
              fontWeight: "bold",
              textTransform: "uppercase",
              zIndex: 1,
            }}
          />
        )}

        <IconButton
          sx={{ position: "absolute", top: 8, right: 8, bgcolor: "#ffffff99" }}
          onClick={handleMenuOpen}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {user.ativo ? (
            <MenuItem onClick={handleRemover}>
              <BlockIcon fontSize="small" sx={{ mr: 1 }} />
              Desativar
            </MenuItem>
          ) : (
            <MenuItem onClick={handleAtivar}>
              <CheckIcon fontSize="small" sx={{ mr: 1 }} />
              Ativar
            </MenuItem>
          )}
        </Menu>
      </Box>

      <CardContent>
        <Box
          className="flexColumn"
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          <Typography gutterBottom variant="h6" component="div">
            {user.contato.nome}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {idade} anos
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
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {captalizarPrimeiraLetra(user.tipoUsuario)}
          </Typography>
          <Box className="flexColumnCenter">
            <Botao
              sx={{ mt: 2 }}
              onClick={() => navigate("/usuarios/" + user.id)}
              txt="Visualizar"
              icon={<VisibilityIcon />}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Parceiros;
