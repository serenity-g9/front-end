import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  CircularProgress,
  Rating,
} from "@mui/material";
import { fetchData } from "../services/DataService";
import { useAlerta } from "../context/AlertaContext";
import dayjs from "dayjs";
import PageModal from "../components/pageModal/PageModal";
import { useLayout } from "../layouts/Layout";

const PaginaUsuario = () => {
  const { setTitulo, setActions } = useLayout();

  const { userId } = useParams(); // ID do usuário vindo da URL
  const [usuario, setUsuario] = useState(null); // Estado para armazenar os dados do usuário
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const alerta = useAlerta();

  useEffect(() => {
    setTitulo("");
    setActions(null);

    const carregarUsuario = async () => {
      try {
        setLoading(true);
        const response = await fetchData(`usuarios/${userId}`); // Busca dinâmica pelo ID
        if (response.error) {
          alerta.error("Usuário não encontrado.");
          setUsuario(null);
        } else {
          console.log(response); // Visualizar o objeto retornado no console
          setUsuario(response);
        }
      } catch (error) {
        alerta.error("Erro ao buscar dados do usuário.");
        console.error(error);
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    };

    carregarUsuario();
  }, [userId, setTitulo, setActions, alerta]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!usuario) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h5">Usuário não encontrado.</Typography>
      </Box>
    );
  }

  // Função para formatar CPF
  const formatarCpf = (cpf) =>
    cpf === null
      ? "Não informado"
      : cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

  const StyledTypography = styled(Typography)`
    font-size: 14px;
    color: #555;
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 20px;
    display: inline-block;
    margin-left: 32%;
    width: 50%;
  `;
  const StyledTypography2 = styled(Typography)`
    margin-left: 16%;
  `;

  const StyledTypography3 = styled(Typography)`
    margin-top: 5%;
    margin-left: 32%;
  `;

  const StyledTypography4 = styled(Typography)`
    margin-top: 5%;
    margin-left: 10%;
  `;

  const StyledTypography5 = styled(Typography)`
    font-size: 14px;
    color: #555;
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 20px;
    display: inline-block;
    margin-left: 10%;
    width: 50%;
  `;

  return (
    <PageModal>
      <Typography mb={5} variant="h4">
        Perfil do usuário
      </Typography>
      <Box display="flex">
        {/* Coluna Esquerda */}
        <Box sx={{ maxWidth: "300px", textAlign: "center", mr: 3 }}>
          <CardMedia
            component="img"
            image="https://dummyimage.com/800x800/eee/000"
            alt="Foto de perfil"
            sx={{
              width: 280,
              height: 280,
              borderRadius: 2,
              mx: "auto",
              objectFit: "cover",
              marginLeft: "90px",
              marginTop: "20px",
            }}
          />
          <Typography
            variant="h6"
            sx={{ mt: 2 }}
            marginLeft={"140px"}
            fontSize={"26px"}
          >
            {usuario.contato.nome}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
            marginLeft={"140px"}
            fontWeight="bold"
          >
            {usuario.tipoUsuario.charAt(0).toUpperCase() +
              usuario.tipoUsuario.slice(1)}
          </Typography>
          {/* Exibição do Rating */}
          <Box mt={2}>
            <Typography variant="body1" fontWeight="bold" marginLeft={"140px"}>
              Avaliação:
            </Typography>
            <Rating
              name="user-rating"
              value={usuario.rating || 4}
              precision={0.5}
              readOnly
              sx={{
                marginLeft: "140px", // Ajuste a margem para a esquerda
              }}
            />
          </Box>
        </Box>

        {/* Coluna Direita */}
        <CardContent sx={{ flex: 1 }}>
          <StyledTypography2 variant="h5" fontWeight="bold" mb={1}>
            {usuario.contato.nome}
          </StyledTypography2>
          <StyledTypography2
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {usuario.email}
          </StyledTypography2>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <StyledTypography3 variant="body1" fontWeight="bold">
                Nome completo:
              </StyledTypography3>
              <StyledTypography variant="body2">
                {usuario.contato.nome}
              </StyledTypography>
            </Grid>
            <Grid item xs={6}>
              <StyledTypography4 variant="body1" fontWeight="bold">
                Idade:
              </StyledTypography4>
              <StyledTypography5 variant="body2">
                {dayjs().diff(dayjs(usuario.contato.dataNascimento), "year")}{" "}
                anos
              </StyledTypography5>
            </Grid>
            <Grid item xs={6}>
              <StyledTypography3 variant="body1" fontWeight="bold">
                Celular:
              </StyledTypography3>
              <StyledTypography variant="body2">
                {usuario.contato.celular !== null
                  ? usuario.contato.celular.replace(
                      /(\d{2})(\d{5})(\d{4})/,
                      "($1) $2-$3"
                    )
                  : "Não informado"}
              </StyledTypography>
            </Grid>
            <Grid item xs={6}>
              <StyledTypography4 variant="body1" fontWeight="bold">
                CPF:
              </StyledTypography4>
              <StyledTypography5 variant="body2">
                {formatarCpf(usuario.contato.cpf)}
              </StyledTypography5>
            </Grid>
            <Grid item xs={6}>
              <StyledTypography3 variant="body1" fontWeight="bold">
                Data de Nascimento:
              </StyledTypography3>
              <StyledTypography variant="body2">
                {usuario.contato.dataNascimento === null
                  ? "Não informado"
                  : dayjs(usuario.contato.dataNascimento).format("DD/MM/YYYY")}
              </StyledTypography>
            </Grid>
          </Grid>
        </CardContent>
      </Box>
    </PageModal>
  );
};

export default PaginaUsuario;
