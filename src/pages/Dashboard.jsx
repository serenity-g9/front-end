import React, { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { LineChart, PieChart, ResponsiveChartContainer } from "@mui/x-charts";
import { useTheme } from "@emotion/react";
import { useLayout } from "../layouts/Layout";
import { DatePicker } from "@mui/x-date-pickers";
import { fetchData, fetchParamsData } from "../services/DataService";
import { useAlerta } from "../context/AlertaContext";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { formatCurrency, formatPercentage } from "../utils/util";

const Dashboard = () => {
  const { setTitulo, setActions } = useLayout();

  const alerta = useAlerta();

  const [inicio, setInicio] = useState(dayjs().subtract(1, "year"));
  const [fim, setFim] = useState(dayjs().add(30, "day"));
  const [dados, setDados] = useState({});

  useEffect(() => {
    (async () => {
      const response = await fetchParamsData("dashboard", {
        idUsuario: Cookies.get("ID"),
        inicio: inicio.toISOString().split("T")[0],
        fim: fim.toISOString().split("T")[0],
      });

      if (response.error) {
        alerta.error("Erro ao buscar dados");
        return;
      }

      console.log(response);

      setDados(response);
    })();
  }, [inicio, fim]);

  useEffect(() => {
    setTitulo("Dashboard");
    setActions(null);
  });
  const tileStyle = {
    padding: 16,
    color: "#333",
  };

  const theme = useTheme();

  const data1 = [
    { label: "Não iniciado", value: 100, color: theme.palette.paper.dark },
    { label: "Em andamento", value: 300, color: theme.palette.primary.main },
    { label: "Finalizado", value: 300, color: theme.palette.secondary.main },
  ];

  const uData = [35, 30, 22, 27, 21, 23, 34];
  const xLabels = ["MAR", "ABR", "JUN", "JUL", "AGO", "SET", "OUT"];

  const kpisData = [
    { label: "Colaboradores ativos", value: "382", variant: "primary" },
    { label: "A ser faturado", value: "R$ 12.972,89", variant: "secondary" },
    { label: "Atrasos por evento", value: "4,4 %" },
    { label: "Não comparecimentos", value: "12" },
  ];

  return (
    <Box>
      <Grid container>
        <Grid item size={5}>
          <Grid container spacing={3} pl={4} pr={4}>
            <Grid item size={6}>
              <DatePicker
                label="Início"
                value={inicio}
                onChange={(newValue) => setInicio(newValue)}
              />
            </Grid>
            <Grid item size={6}>
              <DatePicker
                label="Fim"
                value={fim}
                minDate={inicio}
                onChange={(newValue) => setFim(newValue)}
              />
            </Grid>
            <Kpi
              size={6}
              label="Balanço"
              value={
                Number(dados.balanco)
                  ? formatCurrency(dados.balanco)
                  : formatCurrency(0)
              }
              variant="secondary"
            />

            <Kpi
              size={6}
              label="Atrasos por evento"
              value={
                Number(dados.atrasosPorEventoPercentual)
                  ? formatPercentage(dados.atrasosPorEventoPercentual)
                  : formatPercentage(0)
              }
            />
          </Grid>
          <Box className="flexRowCenter" mt={4}>
            <Grid container spacing={3} pl={4} pr={4} width={500}>
              <Kpi
                label="Ocorrendo"
                value={Number(dados.qtdPorStatusEvento?.OCORRENDO) || 0}
                variant="primary"
                size={6}
              />

              <Kpi
                label="Em breve"
                value={Number(dados.qtdPorStatusEvento?.EM_BREVE) || 0}
                variant="primary"
                size={6}
              />

              <Kpi
                label="Finalizados"
                value={Number(dados.qtdPorStatusEvento?.FINALIZADO) || 0}
                variant="primary"
                size={6}
              />

              <Kpi
                label="Pendente"
                value={Number(dados.qtdPorStatusEvento?.PENDENTE) || 0}
                variant="primary"
                size={6}
              />
            </Grid>
          </Box>
        </Grid>
        <Grid item size={7}>
          <Grid container width="100%" pr={2}>
            <Grid item size={12}>
              <Paper style={tileStyle} elevation={3}>
                <Typography variant="h6">
                  Quantidade de Eventos por Mês
                </Typography>

                {dados.qtdEventosPorAnoMes && (
                  <LineChart
                    height={500}
                    series={[
                      {
                        data: Object.entries(dados.qtdEventosPorAnoMes)
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([, value]) => value),
                        label: "Qtd. de Eventos",
                        color: theme.palette.secondary.main,
                      },
                    ]}
                    xAxis={[
                      {
                        scaleType: "point",
                        data: Object.entries(dados.qtdEventosPorAnoMes)
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([key]) => key),
                      },
                    ]}
                    slotProps={{
                      legend: { hidden: true },
                    }}
                  />
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

const Kpi = ({ label, value, variant, size = { xs: 12, sm: 6, md: 3 } }) => {
  let style = {};

  switch (variant) {
    case "primary":
      style = {
        bg: "primary.main",
        font: "white.main",
      };
      break;

    case "secondary":
      style = {
        bg: "secondary.main",
        font: "white.main",
      };
      break;

    default:
      style = {
        bg: "white.main",
        font: "primary.main",
      };
      break;
  }

  return (
    <Grid item size={size}>
      <Paper sx={{ bgcolor: style.bg }} elevation={3}>
        <Box
          className="flexColumn"
          sx={{
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            height: 150,
          }}
        >
          <Typography color={style.font} variant="h6">
            {label}
          </Typography>
          <Typography color={style.font} fontSize={40}>
            {value}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
};

export default Dashboard;
