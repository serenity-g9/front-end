import {
  Box,
  Button,
  ButtonBase,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid2,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Registro from "../../layouts/Registro";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import dayjs from "dayjs";
import GroupIcon from "@mui/icons-material/Group";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState } from "react";
import CampoSugestao from "../../components/input/CampoSugestao";
import {
  fetchData,
  patchData,
  patchParamsData,
  postData,
} from "../../services/DataService";
import Botao from "../../components/btn/Botao";
import Picklist from "../../components/input/Picklist";
import { useAlerta } from "../../context/AlertaContext";
import CampoTexto from "../../components/input/CampoTexto";
import { funcoesAlocacao } from "../../utils/dataMockUtil";
import PicklistFiltro from "../../components/input/PicklistFiltro";
import { useLayout } from "../../layouts/Layout";

const RegistroDemanda = () => {
  const {
    setTitulo,
    setActions,
    toggleDialog,
    setDialogContent,
    setDialogAction,
  } = useLayout();
  const navigate = useNavigate();
  const { recordId } = useParams();
  const alerta = useAlerta();
  const [escalaOptions, setEscalaOptions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const columnsEscala = [
    {
      field: "funcaoEscala",
      headerName: "Função",
      flex: 1.5,
    },
    {
      field: "qtdColaborador",
      headerName: "Qtd. Colaboradores",
      flex: 1,
    },
    {
      field: "horasJornada",
      headerName: "Horas Jornada",
      flex: 1,
    },
    {
      field: "valor",
      headerName: "Custo Total",
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
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set("tab", "Agendamentos");

              newParams.set(
                "filters",
                JSON.stringify([
                  {
                    field: "funcao",
                    operator: "picklist",
                    id: 63673,
                    value: [params.row.funcaoEscala],
                  },
                ])
              );

              setSearchParams(newParams);
            }}
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

  const statusStyles = {
    "Não Alocado": { color: "black", backgroundColor: "#e2e2e2" },
    "Em Andamento": { color: "white", backgroundColor: "#FB8C00" },
    Pendente: { color: "black", backgroundColor: "#FFEB3B" },
    Confirmado: { color: "white", backgroundColor: "#2196F3" },
    Finalizado: { color: "white", backgroundColor: "#4CAF50" },
  };

  const handleDesfazerConvite = async (id) => {
    const response = await patchData("agendamentos", id, "reject");

    if (response.error) {
      alerta.error("Erro ao desfazer convite");
    }

    alerta.success("Convite desfeito com sucesso");
  };

  const columnsAgendamento = [
    {
      field: "funcao",
      headerName: "Função",
      flex: 1,
      filterable: true,
      filterOperators: [
        {
          label: "Picklist Filter",
          value: "picklist",
          getApplyFilterFn: (filterItem) => {
            if (!filterItem.value || filterItem.value.length === 0) {
              return null;
            }

            return (value) => filterItem.value.includes(value);
          },
          InputComponent: (props) => (
            <PicklistFiltro
              {...props}
              options={[...new Set(escalaOptions.map((item) => item.value))]}
            />
          ),
        },
      ],
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      align: "center",
      renderCell: (params) => {
        const style = statusStyles[params.value] || {};
        return (
          <Chip sx={{ width: "60%" }} label={params.value} style={style} />
        );
      },
      filterable: true,
      filterOperators: [
        {
          label: "Picklist Filter",
          value: "picklist",
          getApplyFilterFn: (filterItem) => {
            if (!filterItem.value || filterItem.value.length === 0) {
              return null;
            }

            return (value) => filterItem.value.includes(value);
          },
          InputComponent: (props) => (
            <PicklistFiltro
              {...props}
              options={[
                "Não Alocado",
                "Pendente",
                "Confirmado",
                "Em Andamento",
                "Finalizado",
              ]}
            />
          ),
        },
      ],
    },
    {
      field: "usuario",
      headerName: "Colaborador",
      type: "text",
      flex: 1,
      renderCell: (params) => {
        return params.row.usuario ? (
          <Typography
            mt={1.5}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                navigate("/usuarios/" + params.row.usuario.id);
            }}
            role="button"
            tabIndex={0}
            sx={{
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => navigate("/usuarios/" + params.row.usuario.id)}
            fontSize={16}
          >
            {params.row.usuario.contato.nome}
          </Typography>
        ) : (
          "-"
        );
      },
    },
    {
      field: "horarioEntrada",
      headerName: "Entrada",
      type: "text",
      flex: 1,
      renderCell: (params) => {
        return dayjs(params.value).format("DD/MM/YYYY HH:mm") || "-";
      },
    },
    {
      field: "horarioSaida",
      headerName: "Saída",
      type: "text",
      flex: 1,
      renderCell: (params) => {
        return params.value
          ? dayjs(params.value).format("DD/MM/YYYY HH:mm")
          : "-";
      },
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
          {!["Confirmado", "Finalizado"].includes(params.row.status) &&
            (params.row.usuario ? (
              <Tooltip title="Remover agendamento">
                <ButtonBase
                  key={`view-${params.id}`}
                  sx={{ marginRight: 0.5, borderRadius: 2 }}
                  onClick={() => handleDesfazerConvite(params.row.id)}
                >
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    width={39}
                  >
                    <PersonRemoveIcon sx={{ color: "error.main" }} />
                  </Box>
                </ButtonBase>
              </Tooltip>
            ) : (
              <Tooltip title="Convidar usuário">
                <ButtonBase
                  key={`view-${params.id}`}
                  sx={{ marginRight: 0.5, borderRadius: 2 }}
                  onClick={() => handleConvidarAgendamento(params.row)}
                >
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    width={39}
                  >
                    <PersonAddIcon sx={{ color: "#515151" }} />
                  </Box>
                </ButtonBase>{" "}
              </Tooltip>
            ))}
        </span>
      ),
    },
  ];

  let struct = {
    object: {
      name: "Demanda",
      value: "demanda",
      resource: "demandas",
    },
    header: {
      fields: [
        {
          name: "Evento",
          value: "evento.nome",
          type: "text",
        },
      ],
    },
    tabs: [
      {
        name: "Detalhes",
        sections: [
          {
            name: "Evento",
            fields: [
              {
                label: "Nome",
                name: "nome",
                value: "nome",
              },
              {
                label: "Custo Total",
                name: "custoTotal",
                value: "custoTotal",
                type: "dinheiro",
                immutable: true,
              },
              {
                label: "Início",
                name: "inicio",
                value: "inicio",
                type: "date",
                errorMsg: "O início não pode ser anterior ao presente.",
              },
              {
                label: "Fim",
                name: "fim",
                value: "fim",
                type: "date",
                minDateTime: "inicio",
                errorMsg: "O fim não pode ser anterior ao início.",
              },
              {
                label: "Tipo de Contrato",
                name: "tipoContrato",
                value: "tipoContrato",
                immutable: true,
              },
              {
                label: "Coordenador",
                name: "responsavel",
                value: "responsavel.contato.nome",
                immutable: true,
              },
            ],
          },
        ],
      },
      {
        name: "Escalas",
        sections: [
          {
            columns: columnsEscala,
            rowsValue: "escalas",
          },
        ],
      },
      {
        name: "Agendamentos",
        sections: [
          {
            columns: columnsAgendamento,
            rowsValue: "agendamentos",
          },
        ],
      },
    ],
    tabsAction: [
      {
        id: "Escalas",
        label: "Adicionar escala",
        icon: <GroupIcon />,
        type: "function",
        action: ({ id }) => handleAdicionarEscala(id),
      },
      {
        id: "Agendamentos",
        label: "Convidar",
        icon: <SendIcon />,
        type: "function",
        action: () => setOpen(true),
      },
    ],
  };

  const [open, setOpen] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedEscala, setSelectedEscala] = useState({ id: "", value: "" });

  const handleEscalaChange = (e) => {
    const escala = escalaOptions.find((escala) => escala.id === e.target.value);

    setSelectedEscala(escala);
  };

  useEffect(() => {
    (async () => {
      const response = await fetchData("usuarios");
      setUserOptions(
        response.map((item) => {
          return {
            id: item.email,
            name: item.contato.nome,
            email: item.email,
          };
        })
      );
    })();

    (async () => {
      const response = await fetchData(`escalas/${recordId}/demanda`);

      setEscalaOptions(
        response.map((escala) => {
          return {
            value: escala.funcaoEscala,
            id: escala.id,
          };
        })
      );
    })();
  }, [open, recordId]);

  const handleAdicionarEscala = (id) => {
    setIdDemandaAtual(id);
    setAdicionarEscalaOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;

    setSelectedUsers([]);
    setSelectedEscala({ id: "", value: "" });
    setOpen(false);
  };

  const handleConvidar = async () => {
    const request = {
      emails: selectedUsers.map((user) => {
        return user.email;
      }),
    };

    const response = await postData(
      `escalas/${selectedEscala.id}/invite`,
      request
    );

    if (response.error) {
      alerta.error("Não foi possível realizar o agendamento.");
      return;
    }

    alerta.success("Convites enviados com sucesso.");
    struct = { ...struct };
    handleClose();
  };
  const [agendamentoAtual, setAgendamentoAtual] = useState({});
  const [convidarAgendamentoOpen, setConvidarAgendamentoOpen] = useState(false);

  const handleConvidarAgendamento = (agendamento) => {
    setAgendamentoAtual(agendamento);
    setConvidarAgendamentoOpen(true);
  };

  const [idDemandaAtual, setIdDemandaAtual] = useState("");
  const [adicionarEscalaOpen, setAdicionarEscalaOpen] = useState(false);

  return (
    <>
      <AdicionarEscalaDialog
        open={adicionarEscalaOpen}
        setOpen={setAdicionarEscalaOpen}
        id={idDemandaAtual}
      />
      <ConviteAgendamentoDialog
        open={convidarAgendamentoOpen}
        setOpen={setConvidarAgendamentoOpen}
        agendamento={agendamentoAtual}
        userOptions={userOptions}
      />
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{"Convidar colaboradores"}</DialogTitle>
        <DialogContent>
          <Grid2 container spacing={2}>
            <Picklist
              size={12}
              label={"Função"}
              name={"funcao"}
              value={selectedEscala.id}
              handleChange={handleEscalaChange}
              items={escalaOptions}
            />
            <CampoSugestao
              options={userOptions}
              onChange={(event, value) => setSelectedUsers(value)}
            />
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Botao
            color="primary"
            variant="outlined"
            txt="Cancelar"
            onClick={handleClose}
          />
          <Botao
            onClick={handleConvidar}
            disabled={selectedUsers.length === 0 || selectedEscala.id === ""}
            txt="Convidar"
          />
        </DialogActions>
      </Dialog>
      <Registro
        setTitulo={setTitulo}
        setActions={setActions}
        toggleDialog={toggleDialog}
        setDialogContent={setDialogContent}
        setDialogAction={setDialogAction}
        struct={struct}
      />{" "}
    </>
  );
};

const AdicionarEscalaDialog = ({ open, setOpen, id }) => {
  const alerta = useAlerta();

  const [disabled, setDisabled] = useState(true);
  const [escalaAtual, setEscalaAtual] = useState({
    funcao: {
      id: "",
      value: "",
    },
    qtdColaborador: "",
    horasJornada: "",
    valor: "",
  });

  useEffect(() => {
    const { funcao, qtdColaborador, horasJornada, valor } = escalaAtual;

    setDisabled(!funcao.value || !qtdColaborador || !horasJornada || !valor);
  }, [escalaAtual]);

  const handleChange = (e, name) => {
    setEscalaAtual({ ...escalaAtual, [name]: e.target.value });
  };

  const handleFuncaoEscalaChange = (e) => {
    const funcao = funcoesAlocacao.filter((f) => f.id === e.target.value)[0];
    setEscalaAtual({ ...escalaAtual, funcao: funcao });
  };

  const cadastrarEscala = async () => {
    const request = {
      ...escalaAtual,
      idDemanda: id,
      funcaoEscala: escalaAtual.funcao.id,
      valor: Number(escalaAtual.valor.replaceAll(".", "").replace(",", ".")),
    };

    const response = await postData("escalas", request);

    if (response.error) {
      alerta.error("Não foi possível adicionar a escala");
      return;
    }

    alerta.success("Escala criada com sucesso");

    handleClose();
  };

  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpen(false);

    setEscalaAtual({
      funcao: {
        id: "",
        value: "",
      },
      qtdColaborador: "",
      horasJornada: "",
      valor: "",
    });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{"Adicionar escala"}</DialogTitle>
      <DialogContent>
        <FormControl
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Picklist
            size={12}
            label={"Função"}
            name={"funcao"}
            value={escalaAtual.funcao.id}
            handleChange={handleFuncaoEscalaChange}
            items={funcoesAlocacao}
          />
          <CampoTexto
            size={12}
            handleChange={handleChange}
            mascara="numeroPositivo"
            name="qtdColaborador"
            value={escalaAtual.qtdColaborador}
            label="Qtd Colaboradores"
            textSize={{ min: 0, max: 48 }}
          />
          <CampoTexto
            size={12}
            handleChange={handleChange}
            mascara="numeroPositivo"
            name="horasJornada"
            value={escalaAtual.horasJornada}
            label="Horas da Jornada"
            textSize={{ min: 0, max: 48 }}
          />
          <CampoTexto
            size={12}
            handleChange={handleChange}
            mascara="dinheiro"
            name="valor"
            value={escalaAtual.valor}
            startAdornment="R$"
            textSize={{ min: 0, max: 48 }}
            label="Valor"
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Botao
          variant="outlined"
          color="primary"
          txt="Cancelar"
          onClick={handleClose}
        />
        <Botao
          txt="Inserir Escala"
          disabled={disabled}
          onClick={cadastrarEscala}
        />
      </DialogActions>
    </Dialog>
  );
};

const ConviteAgendamentoDialog = ({
  open,
  setOpen,
  agendamento,
  userOptions,
}) => {
  const [selectedUser, setSelectedUser] = useState({});
  const alerta = useAlerta();

  const handleConvidar = async () => {
    const response = await patchParamsData(
      `agendamentos/${agendamento.id}/invite`,
      { email: selectedUser.email }
    );

    if (response.error) {
      alerta.error("Não foi possível realizar o convite");
      return;
    }

    alerta.success("Convite enviado com sucesso");
    handleClose();
  };

  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpen(false);

    setSelectedUser({});
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{"Convidar colaboradores"}</DialogTitle>
      <DialogContent>
        <Grid2 container spacing={2}>
          <TextField fullWidth value={agendamento.funcao} />
          <CampoSugestao
            multiple={false}
            options={userOptions}
            onChange={(event, value) => setSelectedUser(value)}
          />
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Botao
          color="primary"
          variant="outlined"
          txt="Cancelar"
          onClick={handleClose}
        />
        <Botao
          onClick={handleConvidar}
          disabled={!selectedUser}
          txt="Convidar"
        />
      </DialogActions>
    </Dialog>
  );
};

export default RegistroDemanda;
