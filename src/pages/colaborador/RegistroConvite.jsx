import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Registro from "../../layouts/Registro";
import CancelIcon from "@mui/icons-material/Cancel";
import BlockIcon from "@mui/icons-material/Block";
import ClearIcon from "@mui/icons-material/Clear";
import html2canvas from "html2canvas";
import { useRef, useState } from "react";
import logo from "/logo.png";
import dayjs from "dayjs";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { numToMes } from "../../utils/util";
import DownloadIcon from "@mui/icons-material/Download";
import { useTheme } from "@emotion/react";
import { useLayout } from "../../layouts/Layout";

const RegistroConvite = () => {
  const {
    setTitulo,
    setActions,
    toggleDialog,
    setDialogContent,
    setDialogAction,
  } = useLayout();

  const captureRef = useRef(null);

  const [convite, setConvite] = useState({});
  const [open, setOpen] = useState(false);

  const handleSalvar = async () => {
    if (!captureRef.current) return;
    const canvas = await html2canvas(captureRef.current, { scale: 3 });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const link = document.createElement("a");
    link.href = imgData;
    link.download = `${convite.nome}_${convite.funcao}_${dayjs(
      convite.horarioEntrada
    ).format("HH-mm")}_convite.jpg`;
    link.click();
  };

  const handleAbrirConvite = (objeto) => {
    setConvite(objeto);
    setOpen(true);
  };

  const struct = {
    object: {
      name: "Convite",
      value: "convite",
      resource: "agendamentos",
      readOnly: true,
    },
    header: {
      fields: [
        // {
        //   name: "Evento",
        //   value: "nome",
        //   type: "text",
        // },
        // {
        //   name: "Função",
        //   value: "funcao",
        //   type: "text",
        // },
        // {
        //   name: "Cachê",
        //   value: "cache",
        //   type: "currency",
        // },
        // {
        //   name: "Entrada",
        //   value: "horarioEntrada",
        //   type: "date",
        // },
        // {
        //   name: "Local",
        //   value: "endereco.local",
        //   type: "text",
        // },
      ],
    },
    headerActions: [
      // {
      //   label: "Cancelar",
      //   icon: <ClearIcon />,
      //   variant: "outlined",
      //   color: "error",
      //   action: (objeto) => console.log(objeto),
      // },
      {
        label: "Check‑in",
        icon: <QrCodeIcon />,
        variant: "contained",
        color: "secondary",
        action: (objeto) => handleAbrirConvite(objeto),
      },
    ],

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
                label: "Evento",
                name: "nome",
                value: "nome",
                immutable: true,
              },
              {
                label: "Cachê",
                name: "cache",
                value: "cache",
                type: "dinheiro",
                immutable: true,
              },
              {
                label: "Entrada",
                name: "horarioEntrada",
                value: "horarioEntrada",
                type: "date",
                immutable: true,
              },
              {
                label: "Saída",
                name: "horarioSaida",
                value: "horarioSaida",
                type: "date",
                immutable: true,
              },
              {
                label: "Função",
                name: "funcao",
                value: "funcao",
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
                immutable: true,
              },
              {
                label: "Número",
                name: "numero",
                value: "endereco.numero",
                immutable: true,
              },
              {
                label: "CEP",
                name: "cep",
                value: "endereco.cep",
                immutable: true,
              },
              {
                label: "Cidade",
                name: "cidade",
                value: "endereco.cidade",
                immutable: true,
              },
              {
                label: "Estado",
                name: "uf",
                value: "endereco.uf",
                type: "picklist",
                options: [],
                immutable: true,
              },
              {
                label: "Local",
                name: "local",
                value: "endereco.local",
                immutable: true,
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
    ],
  };
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
        <DialogContent>
          <ConviteEntrada captureRef={captureRef} convite={convite} />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleSalvar}
          >
            Baixar
          </Button>
        </DialogActions>
      </Dialog>
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

const ConviteEntrada = ({ convite, captureRef }) => {
  return (
    <Box key="0" width="100%" className="flexColumnCenter" alignItems="center">
      <CamposEntrada convite={convite} />
      <div
        ref={captureRef}
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: "400px",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          mb={5}
          bgcolor="secondary.main"
          sx={{ height: 30, width: "100%" }}
        ></Box>
        <img src={logo} style={{ width: "150px" }} />
        <CamposEntrada convite={convite} />
        <Box
          mt={5}
          bgcolor="primary.main"
          sx={{ height: 30, width: "100%" }}
        ></Box>
      </div>
    </Box>
  );
};

const CamposEntrada = ({ convite }) => {
  return (
    <>
      <img
        width="80%"
        src={`data:image/png;base64,${convite.codigo.imagemQRCode}`}
      />
      <Box>
        <Box
          display="flex"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          gap={5}
          mb={1}
        >
          <Typography variant="subtitle2" color="gray">
            Código
          </Typography>
          <Typography variant="h5">{convite.codigo.digito}</Typography>
        </Box>
        <Box
          display="flex"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          gap={5}
          mb={1}
        >
          <Typography variant="subtitle2" color="gray">
            Evento
          </Typography>
          <Typography variant="h5">{convite.nome}</Typography>
        </Box>
        <Box
          display="flex"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          gap={5}
          mb={1}
        >
          <Typography variant="subtitle2" color="gray">
            Data
          </Typography>
          <Typography variant="h5">
            {dayjs(convite.horarioEntrada).format("DD")}{" "}
            {numToMes(dayjs(convite.horarioEntrada).month()).toLowerCase()}
          </Typography>
        </Box>
        <Box
          display="flex"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          gap={5}
          mb={1}
        >
          <Typography variant="subtitle2" color="gray">
            Horário
          </Typography>
          <Typography variant="h5">
            {dayjs(convite.horarioEntrada).format("HH:mm")}
          </Typography>
        </Box>
        <Box
          display="flex"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          gap={5}
          mb={1}
        >
          <Typography variant="subtitle2" color="gray">
            Função
          </Typography>
          <Typography variant="h5">{convite.funcao}</Typography>
        </Box>
        <Box
          display="flex"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          gap={5}
          mb={1}
        >
          <Typography variant="subtitle2" color="gray">
            Local
          </Typography>
          <Typography variant="h5">{convite.endereco.local}</Typography>
        </Box>
      </Box>
    </>
  );
};

export default RegistroConvite;
