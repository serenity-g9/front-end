import { createContext, useContext, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  CssBaseline,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import BarraLateral from "../components/sidebar/BarraLateral";
import Dashboard from "../pages/Dashboard";
import CriarDemandas from "../pages/demandas/criarDemandas/CriarDemandas";
import Escala from "../pages/Escala";
import Formularios from "../pages/formulario/Formularios";
import Parceiros from "../pages/Parceiros";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Demandas from "../pages/demandas/Demandas";
import Eventos from "../pages/eventos/Eventos";
import CriarEvento from "../pages/eventos/criarEventos/CriarEvento";
import RegistroEvento from "../pages/eventos/RegistroEvento";
import ConfirmDialog from "../components/dialogo/ConfirmDialog";
import ProtectedRoute from "./ProtectedRoute ";
import EventosConfirmados from "../pages/colaborador/Confirmados";
import EventosPendentes from "../pages/colaborador/Pendentes";
import Convites from "../pages/colaborador/Convites";
import BuscarEventos from "../pages/colaborador/BuscarEventos";
import Configuracoes from "../pages/Configuracoes";
import { useCollapsed } from "../context/CollapsedContext";
import RegistroDemanda from "../pages/demandas/RegistroDemanda";
import RegistroFormulario from "../pages/formulario/RegistroFormulario";
import RegistroConvite from "../pages/colaborador/RegistroConvite";
import CheckIn from "../pages/CheckIn";
import ConfirmarAgendamento from "../pages/ConfirmarAgendamento";
import BottomNav from "../components/bottomNav/BottomNav";
import { useTheme } from "@emotion/react";
import Cadastro from "../pages/Cadastro";
import PaginaUsuario from "../pages/PaginaUsuario";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import MailIcon from "@mui/icons-material/MailOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { useUser } from "../context/UserContext";
import { guestPages } from "../utils/util";
import GuestRoute from "./GuestRoute";
import CriarFuncionario from "../pages/CriarFuncionario";

const LayoutContext = createContext();
export const useLayout = () => useContext(LayoutContext);

const Layout = () => {
  const location = useLocation();

  const menuItems = {
    parceiro: [
      {
        smallText: false,
        activePath: "/",
        icon: <HomeIcon />,
        linkTo: "/",
        text: "Home",
        sx: { mt: 2 },
      },
      {
        smallText: false,
        activePath: "/dashboard",
        icon: <DashboardOutlinedIcon />,
        linkTo: "/dashboard",
        text: "Dashboard",
      },
      {
        smallText: false,
        activePath: "/eventos",
        icon: <CelebrationOutlinedIcon />,
        linkTo: "/eventos",
        text: "Eventos",
      },
      {
        smallText: false,
        activePath: "/demandas",
        icon: <AssignmentOutlinedIcon />,
        linkTo: "/demandas",
        text: "Demandas",
      },
      {
        smallText: false,
        activePath: "/check-in",
        icon: <QrCodeIcon />,
        linkTo: "/check-in",
        text: "Check in",
      },
      {
        isSubMenu: true,
        label: "Equipe",
        icon: <GroupIcon />,
        items: [
          {
            activePath: "/formularios",
            linkTo: "/formularios",
            icon: <ArticleOutlinedIcon />,
            text: "Formulários",
            theme: "primary.lighter",
          },
          {
            activePath: "/funcionarios",
            linkTo: "/funcionarios",
            icon: <ContactsOutlinedIcon />,
            text: "Funcionários",
            theme: "primary.lighter",
          },
        ],
      },
    ],
    colaborador: [
      {
        smallText: false,
        activePath: "/",
        icon: <HomeIcon />,
        linkTo: "/",
        text: "Home",
        sx: { mt: 2 },
      },
      {
        smallText: false,
        activePath: "/eventos-confirmados",
        icon: <CelebrationOutlinedIcon />,
        linkTo: "/eventos-confirmados",
        text: "Eventos",
        theme: "primary.lighter",
      },
      {
        smallText: false,
        activePath: "/convites",
        icon: <MailIcon />,
        linkTo: "/convites",
        text: "Convites",
        theme: "primary.lighter",
      },
    ],
  };

  const { tipoUsuario } = useUser();
  const { collapsed } = useCollapsed();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const showNav = !guestPages.includes(location.pathname) && !!tipoUsuario;

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({});
  const [dialogAction, setDialogAction] = useState(null);

  const [titulo, setTitulo] = useState("");
  const [actions, setActions] = useState([]);

  const toggleDialog = () => {
    setOpenDialog(!openDialog);
  };

  return (
    <LayoutContext.Provider
      value={{
        mobile,
        toggleDialog,
        setDialogAction,
        setDialogContent,
        setTitulo,
        setActions,
      }}
    >
      <ConfirmDialog
        action={dialogAction}
        content={dialogContent}
        open={openDialog}
        toggleDialog={toggleDialog}
      />
      <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
        <CssBaseline />
        {showNav && <Navbar />}
        <div className="app">
          {showNav && !mobile && <BarraLateral menuItems={menuItems} />}
          <Box
            sx={{
              overflow: showNav ? "scroll" : "hidden",
            }}
            p={showNav ? 2 : 0}
            style={{
              left: `${!mobile && showNav ? (collapsed ? 80 : 260) : 0}px`,
              width: `calc(100% - ${
                !mobile && showNav ? (collapsed ? 80 : 260) : 0
              }px)`,
              bgcolor: "#f0f0f0",
            }}
            className="content"
          >
            {titulo !== "" && (
              <Box mb={4}>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"flex-end"}
                >
                  <Typography variant="h4">{titulo}</Typography>
                  <ButtonGroup variant="contained" color="secondary">
                    {actions &&
                      actions.map((action, index) => (
                        <Button
                          startIcon={action.icon}
                          key={index}
                          onClick={action.handleClick}
                          disabled={action.isLoading}
                        >
                          {action.label}
                        </Button>
                      ))}
                  </ButtonGroup>
                </Box>
                <Breadcrumb />
              </Box>
            )}
            <Routes>
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
              </Route>
              <Route
                element={
                  <ProtectedRoute allowedTypes={["parceiro", "colaborador"]} />
                }
              >
                <Route path="/" element={<Home />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
              </Route>
              <Route element={<ProtectedRoute allowedTypes={["parceiro"]} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/eventos" element={<Eventos />} />
                <Route path="/check-in" element={<CheckIn />} />
                <Route
                  path="/check-in/:agendamentoId"
                  element={<ConfirmarAgendamento />}
                />
                <Route path="/eventos/:recordId" element={<RegistroEvento />} />
                <Route
                  path="/demandas/:recordId"
                  element={<RegistroDemanda />}
                />
                <Route path="/usuarios/:userId" element={<PaginaUsuario />} />
                <Route path="/eventos/criar" element={<CriarEvento />} />
                <Route path="/demandas" element={<Demandas />} />
                <Route path="/demandas/criar" element={<CriarDemandas />} />
                <Route path="/escala" element={<Escala />} />
                <Route path="/formularios" element={<Formularios />} />
                <Route
                  path="/formularios/:recordId"
                  element={<RegistroFormulario />}
                />
                <Route path="/funcionarios" element={<Parceiros />} />
                <Route
                  path="/funcionarios/adicionar"
                  element={<CriarFuncionario />}
                />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route
                element={<ProtectedRoute allowedTypes={["colaborador"]} />}
              >
                <Route
                  path="/eventos-confirmados"
                  element={<EventosConfirmados />}
                />
                <Route
                  path="/eventos-pendentes"
                  element={<EventosPendentes />}
                />
                <Route path="/eventos/buscar" element={<BuscarEventos />} />
                <Route path="/convites" element={<Convites />} />
                <Route
                  path="/convites/:recordId"
                  element={<RegistroConvite />}
                />
              </Route>
            </Routes>
          </Box>
        </div>
        {showNav && mobile && <BottomNav menuItems={menuItems} />}
      </Box>
    </LayoutContext.Provider>
  );
};

export default Layout;
