import React, { useEffect, useState } from "react";
import Dialogo from "../../components/dialogo/Dialogo";
import CardEvento from "../../components/card/CardEvento";
import { Box, ButtonBase, Chip, Typography } from "@mui/material";
import Botao from "../../components/btn/Botao";
import CreateIcon from "@mui/icons-material/Create";
import { useLocation, useNavigate } from "react-router-dom";
import { buscarEventos } from "../../services/EventoService";
import { numToMes } from "../../utils/util";
import dayjs from "dayjs";
import defaultimg from "../../assets/evento-card-bg.png";
import MudarVisualizacao from "../../components/mudarVisualizacao/MudarVisualizacao";
import Tabela from "../../components/tabela/Tabela";
import { getEventos } from "../../utils/dataMockUtil";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderAllOutlinedIcon from "@mui/icons-material/BorderAllOutlined";
import {
  exportData,
  fetchData,
  fetchParamsData,
} from "../../services/DataService";
import { useLayout } from "../../layouts/Layout";

const Eventos = () => {
  const { setTitulo, setActions } = useLayout();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const view = queryParams.get("view");

  const columns = [
    {
      field: "nome",
      headerName: "Nome",
      flex: 2,
    },
    {
      field: "inicio",
      headerName: "Início",
      type: "text",
      valueFormatter: (params) => {
        return dayjs(params.value).format("MM/DD/YYYY HH:mm");
      },
      flex: 1,
    },
    {
      field: "fim",
      headerName: "Fim",
      type: "text",
      valueFormatter: (params) => {
        return dayjs(params.value).format("MM/DD/YYYY HH:mm");
      },
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      type: "text",
      flex: 1,
      renderCell: (params) => (
        <Chip
          sx={{ width: "90%" }}
          title="Status do evento"
          color={params.value !== "Em andamento" ? "secondary" : "primary"}
          variant={params.value === "Não iniciado" ? "outlined" : "filled"}
          label={params.value}
        />
      ),
    },
    {
      field: "logradouro",
      headerName: "Logradouro",
      type: "text",
      flex: 2,
    },
    {
      field: "orcamento",
      headerName: "Orçamento",
      type: "text",
      valueFormatter: (params) => {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(params);
      },
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Ações",
      headerAlign: "center",
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <span
          style={{
            display: "flex",
            height: "100%",
            justifyContent: "center",
            padding: "6px",
          }}
        >
          <ButtonBase
            key={`view-${params.id}`}
            sx={{ marginRight: 0.5, borderRadius: 2 }}
            onClick={() => navigate(params.id)}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              width={39}
            >
              <VisibilityIcon sx={{ color: "#515151" }} />
            </Box>
          </ButtonBase>
        </span>
      ),
    },
  ];

  const [filtroStatus, setFiltroStatus] = useState("");
  const [eventos, setEventos] = useState([]);
  const [dataEventos, setDataEventos] = useState([]);

  useEffect(() => {
    setTitulo("Eventos");
  }, [setTitulo]);

  const listarEventos = async () => {
    // const data = await buscarEventos();

    const data = await fetchParamsData("eventos/search", {
      nome: filtroStatus,
    });

    const filteredData = data.filter((evento) =>
      evento.status.includes(
        filtros.find((filtro) => filtro.id === status)?.value || ""
      )
    );

    setEventos(formatarCardEvento(filteredData));

    setDataEventos(
      filteredData.map((evento) => ({
        ...evento,
        logradouro: evento.endereco?.logradouro,
        numero: evento.endereco?.numero,
        cidade: evento.endereco?.cidade,
        uf: evento.endereco?.uf,
      }))
    );
  };

  useEffect(() => {
    listarEventos();
  }, [status, filtroStatus]);

  const navigate = useNavigate();
  useEffect(() => {
    const actions = [
      {
        label: "Criar",
        handleClick: () => navigate("/eventos/criar"),
        icon: <CreateIcon />,
      },
      {
        label: "Exportar",
        handleClick: async () => {
          await exportData("eventos", {
            inicio: "2022-11-11T00:00:00",
            fim: "2026-12-03T00:00:00",
            quantidade: 50,
          });
        },
        icon: <BorderAllOutlinedIcon />,
      },
    ];

    setActions(actions);
  }, [setActions, navigate]);

  const filtros = [
    { id: "nao-iniciado", value: "Não iniciado" },
    { id: "em-andamento", value: "Em andamento" },
    { id: "finalizado", value: "Finalizado" },
    { id: "todos", value: "Todos", isDefault: true },
  ];

  const handleSearchChange = (e) => {
    if (e.key !== "Enter") return;

    setFiltroStatus(e.target.value);

    e.target.value = "";
  };

  return (
    <Box>
      <MudarVisualizacao
        setFiltroStatus={setFiltroStatus}
        handleSearchChange={handleSearchChange}
        opcoesFiltro={filtros}
        nomePesquisado={filtroStatus}
        setNomePesquisado={setFiltroStatus}
      />
      {!view && (
        <Box display={"flex"} flexWrap={"wrap"} gap={2}>
          {eventos &&
            eventos.map((evento, index) => {
              return (
                <CardEvento
                  handleClick={() => navigate(`/eventos/${evento.id}`)}
                  key={index}
                  titulo={evento.evento}
                  date={evento.date}
                  endereco={evento.endereco}
                  url={evento.url}
                />
              );
            })}
          {eventos && eventos.length === 0 && <>Nenhum evento cadastrado</>}
        </Box>
      )}
      {view === "list" && (
        <Box sx={{ bgcolor: "#fdfdfd" }}>
          <Tabela columns={columns} rows={dataEventos} />
        </Box>
      )}
    </Box>
  );
};

const formatarCardEvento = (eventos) => {
  const eventosFmt = [];

  eventos.forEach((e) => {
    const date = dayjs(e.fim);
    eventosFmt.push({
      id: e.id,
      evento: e.nome,
      date: {
        dia: date.date(),
        mes: numToMes(date.month()),
      },
      endereco: `${e.endereco?.logradouro}, ${e.endereco?.numero}`,
      url: e.imagem != null ? e.imagem.url : defaultimg,
    });
  });

  return eventosFmt;
};

export default Eventos;
