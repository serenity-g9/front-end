import { useNavigate } from "react-router-dom";
import { Box, ButtonBase } from "@mui/material";
import img from "../../assets/evento-card-bg.png";
import dayjs from "dayjs";
import { estados } from "../../utils/dataMockUtil";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Registro from "../../layouts/Registro";
import { useLayout } from "../../layouts/Layout";

const RegistroEvento = () => {
  const {
    setTitulo,
    setActions,
    toggleDialog,
    setDialogContent,
    setDialogAction,
  } = useLayout();
  const navigate = useNavigate();

  const columnsDemanda = [
    {
      field: "nome",
      headerName: "Nome",
      flex: 2,
    },
    {
      field: "inicio",
      headerName: "Inicio",
      type: "text",
      flex: 1,
      renderCell: (params) => {
        return dayjs(params.value).format("DD/MM/YYYY HH:mm");
      },
    },
    {
      field: "fim",
      headerName: "Fim",
      type: "text",
      flex: 1,
      renderCell: (params) => {
        return dayjs(params.value).format("DD/MM/YYYY HH:mm");
      },
    },
    {
      field: "responsavel",
      headerName: "Coordenador",
      type: "text",
      valueGetter: (params) => {
        return params?.contato?.nome || "";
      },
      flex: 2,
    },
    {
      field: "tipoContrato",
      headerName: "Tipo Contrato",
      type: "text",
      flex: 1.5,
    },
    {
      field: "custoTotal",
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
            onClick={() => navigate("/demandas/" + params.id)}
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

  const columnsEscala = [
    {
      field: "nomeDemanda",
      headerName: "Demanda",
      flex: 1.5,
    },
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
    // {
    //   field: "actions",
    //   headerName: "Ações",
    //   headerAlign: "center",
    //   width: 160,
    //   sortable: false,
    //   filterable: false,
    //   renderCell: (params) => (
    //     <span
    //       style={{
    //         display: "flex",
    //         height: "100%",
    //         justifyContent: "center",
    //         padding: "6px",
    //       }}
    //     >
    //       <ButtonBase
    //         key={`view-${params.id}`}
    //         sx={{ marginRight: 0.5, borderRadius: 2 }}
    //         onClick={() => navigate("/demandas/" + params.id)}
    //       >
    //         <Box
    //           display={"flex"}
    //           alignItems={"center"}
    //           justifyContent={"center"}
    //           width={39}
    //         >
    //           <VisibilityIcon sx={{ color: "#515151" }} />
    //         </Box>
    //       </ButtonBase>
    //     </span>
    //   ),
    // },
  ];

  const struct = {
    object: {
      name: "Evento",
      value: "evento",
      resource: "eventos",
    },
    header: {
      fields: [
        {
          name: "Status",
          value: "status",
          type: "statusChip",
        },
        {
          name: "Orçamento",
          value: "orcamento",
          type: "currency",
        },
        {
          name: "Data do evento",
          value: "inicio",
          type: "date",
        },
        {
          name: "Coordenador",
          value: "responsavel.contato.nome",
          type: "text",
        },
      ],
    },
    body: {
      image: {
        placeholder: null,
      },
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
                label: "Orçamento",
                name: "orcamento",
                value: "orcamento",
                type: "dinheiro",
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
                label: "Formulário",
                name: "formulario",
                value: "formulario.nome",
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
          {
            name: "Endereço",
            nested: true,
            value: "endereco",
            fields: [
              {
                label: "Logradouro",
                name: "logradouro",
                value: "endereco.logradouro",
              },
              {
                label: "Número",
                name: "numero",
                value: "endereco.numero",
              },
              {
                label: "CEP",
                name: "cep",
                value: "endereco.cep",
                masl: "cep",
              },
              {
                label: "Cidade",
                name: "cidade",
                value: "endereco.cidade",
              },
              {
                label: "Estado",
                name: "uf",
                value: "endereco.uf",
                type: "picklist",
                options: estados,
              },
              {
                label: "Local",
                name: "local",
                value: "endereco.local",
              },
              {
                name: "endereco",
                value: "endereco",
                type: "mapa",
              },
            ],
          },
        ],
      },
      {
        name: "Demandas",
        sections: [
          {
            columns: columnsDemanda,
            rowsValue: "demandas",
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
    ],
    tabsAction: [
      {
        id: "Demandas",
        label: "Adicionar demanda",
        icon: <AssignmentIcon />,
        type: "navigate",
        action: "/demandas/criar?eventId=",
      },
    ],
  };

  return (
    <>
      <Registro
        setTitulo={setTitulo}
        setActions={setActions}
        toggleDialog={toggleDialog}
        setDialogContent={setDialogContent}
        setDialogAction={setDialogAction}
        struct={struct}
      ></Registro>
    </>
  );
};

export default RegistroEvento;
