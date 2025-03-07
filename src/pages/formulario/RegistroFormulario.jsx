import { useEffect, useState } from "react";
import PageModal from "../../components/pageModal/PageModal";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { fetchData } from "../../services/DataService";
import { useAlerta } from "../../context/AlertaContext";
import {
  Backdrop,
  Button,
  ButtonBase,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { Box, display } from "@mui/system";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import OutlinedBox from "../../components/box/OutlinedBox";
import Grid from "@mui/material/Grid2";
import { BarChart } from "@mui/x-charts";
import dayjs from "dayjs";
import { useLayout } from "../../layouts/Layout";
import { ColumnTextField } from "../colaborador/Convites";

const RegistroFormulario = () => {
  const { setTitulo, setActions } = useLayout();

  const [searchParams, setSearchParams] = useSearchParams();
  const actualTab = searchParams.get("tab");
  if (!actualTab) setSearchParams({ tab: "visaoGeral" });

  useEffect(() => {
    setTitulo("");
    setActions(null);
  }, []);

  const { recordId } = useParams();
  const alerta = useAlerta();

  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    (async () => {
      const response = await fetchData(`forms/${recordId}/google`);

      if (response.error) {
        alerta.error(
          "Erro ao buscar resposta, verifique as configurações de acesso ao formulário selecionado"
        );
        navigate("/formularios");
        return;
      }

      setFormData(response);
      setLoading(false);
    })();
  }, [recordId]);

  const getRespostas = (respostas, tipo) => {
    const baseStyle = {
      bgcolor: "#ededed",
      p: 1,
      borderRadius: 2,
      my: 1,
      display: "flex",
      justifyContent: "space-between",
    };
    if (["RADIO", "CHECKBOX", "DROP_DOWN"].includes(tipo)) {
      const responseCounts = respostas.reduce((acc, resposta) => {
        resposta.valor.forEach((v) => {
          acc[v] = (acc[v] || 0) + 1;
        });
        return acc;
      }, {});

      const data = Object.keys(responseCounts).map((key) => ({
        name: key,
        value: responseCounts[key],
      }));

      return (
        <Box
          sx={{
            display: "flex",
            height: 300,
            width: { sm: "100%", md: "70%", lg: "50%" },
            margin: "auto",
          }}
        >
          <BarChart
            xAxis={[{ scaleType: "band", data: data.map((d) => d.name) }]}
            yAxis={[
              {
                valueFormatter: (value) =>
                  Number.isInteger(value) ? value : "",
              },
            ]}
            series={[{ data: data.map((d) => d.value), label: "Respostas" }]}
          />
        </Box>
      );
    } else {
      switch (tipo) {
        case "TEXT":
          return (
            <>
              {respostas.map((resposta, index) => (
                <Box sx={baseStyle} key={index}>
                  <Typography>{resposta.valor[0]}</Typography>
                  <Typography>
                    {dayjs(resposta.horarioEnviado).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                </Box>
              ))}
            </>
          );

        case "DATE":
          return (
            <>
              {respostas.map((resposta, index) => (
                <Box sx={baseStyle} key={index}>
                  <Typography>
                    {dayjs(resposta.valor[0]).format("DD/MM/YYYY")}
                  </Typography>
                  <Typography>
                    {dayjs(resposta.horarioEnviado).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                </Box>
              ))}
            </>
          );

        default:
          return (
            <>
              {respostas.map((resposta, index) => (
                <Box sx={baseStyle} key={index}>
                  <Typography>{resposta.valor[0]}</Typography>
                  <Typography>
                    {dayjs(resposta.horarioEnviado).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                </Box>
              ))}
            </>
          );
      }
    }
  };

  const [resDialogOpen, setResDialogOpen] = useState(false);

  const [resAtual, setResAtual] = useState();

  const handleClick = (res) => {
    setResAtual(mapearRespostas(res));
    console.log(mapearRespostas(res));
    setResDialogOpen(true);
  };

  const handleClose = () => {
    setResDialogOpen(false);
    setResAtual(null);
  };

  const { mobile } = useLayout();

  const mapearRespostas = (dados) => {
    return dados.respostas.reduce((acc, item) => {
      acc[item.idQuestao] = item.valores.join(", "); // Junta múltiplos valores em uma string
      return acc;
    }, {});
  };

  return (
    <>
      <Dialog fullScreen={mobile} open={resDialogOpen} onClose={handleClose}>
        <DialogTitle>Respostas</DialogTitle>
        <DialogContent>
          <Grid2 mt={1} container spacing={2}>
            {formData?.questoes &&
              formData.questoes.map((item, index) => {
                let resposta = resAtual ? resAtual[item.id] || [] : [];

                if (item.tipo === "DATE")
                  resposta = dayjs(resposta).format("DD/MM/YYYY");

                return (
                  <ColumnTextField
                    id={item.id}
                    key={index}
                    label={item.titulo}
                    value={resposta}
                  />
                );
              })}
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
      <PageModal>
        <Backdrop
          open={loading}
          sx={(theme) => ({ zIndex: theme.zIndex.drawer + 2 })}
        >
          <CircularProgress />
        </Backdrop>
        {!loading && (
          <Box mb={1} className="flexRowBetween">
            <Box className="flexRowCenter" gap={1}>
              <ButtonBase
                onClick={() => {
                  navigate("/formularios");
                }}
                disableRipple
                sx={{ borderRadius: "50%", p: "8px" }}
              >
                <ArrowBackIosIcon fontSize="32px" />
              </ButtonBase>
              <Typography variant="h6">Formulário</Typography>
            </Box>
          </Box>
        )}
        {!loading && formData && (
          <>
            <Box
              sx={(theme) => ({
                position: "sticky",
                top: -16,
                zIndex: theme.zIndex.drawer - 1,
                bgcolor: "#ffffff",
              })}
            >
              <Box
                mb={3}
                p={1}
                className="flexRowBetween"
                sx={{ alignItems: "flex-end" }}
              >
                <Box className="flexRowCenter">
                  <Typography variant="h5">{formData.formulario}</Typography>
                </Box>
                <Box className="flexRowStart" sx={{ gap: 10 }}></Box>
                <Box className="flexRowCenter" gap={1}></Box>
              </Box>
              <Divider />
              <Guias />
              <Divider />
            </Box>
            {actualTab && actualTab === "visaoGeral" && (
              <Box>
                {formData?.data &&
                  formData.data.map((item) => (
                    <OutlinedBox key={item.questao.id} sx={{ mt: 3 }}>
                      <Box>
                        <Typography sx={{ mb: 3 }} variant="h6">
                          {item.questao.titulo}
                        </Typography>
                      </Box>
                      {item.respostas &&
                        getRespostas(item.respostas, item.questao.tipo)}
                      {item.respostas.length === 0 && (
                        <Typography>Não há respostas</Typography>
                      )}
                    </OutlinedBox>
                  ))}
              </Box>
            )}
            {actualTab && actualTab === "respostas" && (
              <Box>
                {formData?.respostas &&
                  formData.respostas.map((resposta, index) => (
                    <Box key={resposta.id} sx={{ mt: 3 }}>
                      <Box
                        sx={{
                          bgcolor: "#fafafa",
                          p: 2,
                          borderRadius: 2,
                          my: 1,
                          display: "flex",
                          gap: 2,
                        }}
                      >
                        <Typography>{index + 1}</Typography>
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{
                            backgroundColor: "#dcdcdc",
                          }}
                        />
                        {resposta.email && (
                          <>
                            <Typography
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ")
                                  handleClick(resposta);
                              }}
                              role="button"
                              tabIndex={0}
                              sx={{
                                cursor: "pointer",
                                "&:hover": { textDecoration: "underline" },
                              }}
                              onClick={() => handleClick(resposta)}
                            >
                              {resposta.email}
                            </Typography>
                            <Typography sx={{ ml: "auto" }}>
                              {dayjs(resposta.horarioEnviado).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </Typography>
                          </>
                        )}
                        {!resposta.email && (
                          <>
                            <Typography
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ")
                                  handleClick(resposta);
                              }}
                              role="button"
                              tabIndex={0}
                              sx={{
                                cursor: "pointer",
                                "&:hover": { textDecoration: "underline" },
                              }}
                              onClick={() => handleClick(resposta)}
                            >
                              {dayjs(resposta.horarioEnviado).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                  ))}
              </Box>
            )}
          </>
        )}
      </PageModal>
    </>
  );
};

const Guias = () => {
  const theme = useTheme();
  const { mobile } = useLayout();

  const [searchParams, setSearchParams] = useSearchParams();
  const actualTab = searchParams.get("tab");

  return (
    <Box className="flexRowBetween">
      <Box
        mt={8}
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(2, 1fr)`,
          width: mobile ? "100%" : "30%",
        }}
        gap={5}
      >
        <ButtonBase
          disableRipple
          onClick={() => {
            setSearchParams({ tab: "visaoGeral" });
          }}
          sx={{
            borderBottom: `2px solid ${
              "visaoGeral" === actualTab ? theme.palette.secondary.main : null
            }`,
            pb: "4px",
          }}
        >
          <Typography>Visão geral</Typography>
        </ButtonBase>
        <ButtonBase
          disableRipple
          onClick={() => {
            setSearchParams({ tab: "respostas" });
          }}
          sx={{
            borderBottom: `2px solid ${
              "respostas" === actualTab ? theme.palette.secondary.main : null
            }`,
            pb: "4px",
          }}
        >
          <Typography>Respostas</Typography>
        </ButtonBase>
      </Box>
    </Box>
  );
};

export default RegistroFormulario;
