import { Avatar, Box, CardActionArea, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import MailIcon from "@mui/icons-material/MailOutlined";
import QrCodeIcon from "@mui/icons-material/QrCode";
import Cookies from "js-cookie";
import { useLayout } from "../layouts/Layout";

const Home = () => {
  const { setTitulo, setActions } = useLayout();

  useEffect(() => {
    setTitulo("");
    setActions(null);
  });

  const iconStyle = { color: "secondary", fontSize: "large" };
  const profilePictureUrl = Cookies.get("profile_picture_url");
  const nome = Cookies.get("nome");

  const homeItemsParceiro = [
    {
      label: "Dashboard",
      icon: <DashboardOutlinedIcon {...iconStyle} />,
      linkTo: "/dashboard",
    },
    {
      label: "Eventos",
      icon: <CelebrationOutlinedIcon {...iconStyle} />,
      linkTo: "/eventos",
    },
    {
      label: "Demandas",
      icon: <AssignmentOutlinedIcon {...iconStyle} />,
      linkTo: "/demandas",
    },
    {
      label: "Equipe",
      icon: <GroupOutlinedIcon {...iconStyle} />,
      linkTo: "/funcionarios",
    },
    {
      label: "Check-in",
      icon: <QrCodeIcon {...iconStyle} />,
      linkTo: "/check-in",
    },
    {
      label: "Formulários",
      icon: <DescriptionOutlinedIcon {...iconStyle} />,
      linkTo: "/formularios",
    },
  ];
  const homeItemsColaborador = [
    {
      label: "Eventos",
      icon: <CelebrationOutlinedIcon {...iconStyle} />,
      linkTo: "/eventos-confirmados",
    },
    {
      label: "Convites",
      icon: <MailIcon {...iconStyle} />,
      linkTo: "/convites",
    },
  ];

  return (
    <Box height="100%" m={4}>
      <Box
        className="flexRowStart"
        sx={{ bgcolor: "primary.main", p: 4, gap: 3, borderRadius: 2 }}
      >
        <Avatar
          sx={{ width: 80, height: 80 }}
          src={profilePictureUrl || undefined}
        >
          {!profilePictureUrl && nome ? nome[0] : null}
        </Avatar>
        <Typography color="white" variant="h5">
          Bem vindo(a), {Cookies.get("nome")}
        </Typography>
      </Box>
      <Box
        className="flexRowCenter"
        sx={{ height: "70%" }}
        p={4}
        gap={4}
        flexWrap="wrap"
      >
        {Cookies.get("tipoUsuario") === "parceiro" &&
          homeItemsParceiro.map((item, index) => {
            return <HomeCard key={index} {...item} />;
          })}

        {Cookies.get("tipoUsuario") === "colaborador" &&
          homeItemsColaborador.map((item, index) => {
            return <HomeCard key={index} {...item} />;
          })}
      </Box>
    </Box>
  );
};

const HomeCard = ({ linkTo, label, icon }) => {
  const navigate = useNavigate();

  return (
    <CardActionArea
      onClick={() => navigate(linkTo)}
      sx={{
        bgcolor: "#ffffff",
        width: { xs: "100%", md: 160 },
        height: 160,
        minWidth: { xs: "100%", md: 160 },
        minHeight: 160,
        p: 2,
        borderRadius: 3,
        boxShadow: 1,
      }}
    >
      <Box
        className="flexColumn"
        justifyContent="space-between"
        sx={{ height: "100%" }}
      >
        <Typography variant="body1">{label}</Typography>
        <Box alignSelf="flex-end">{icon}</Box>
      </Box>
    </CardActionArea>
  );
};

export default Home;
