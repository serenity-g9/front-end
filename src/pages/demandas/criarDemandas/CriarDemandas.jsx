import { useEffect, useState } from "react";
import PageModal from "../../../components/pageModal/PageModal";
import { Box, Typography } from "@mui/material";
import Botao from "../../../components/btn/Botao";
import Grid from "@mui/material/Grid2";
import Esteira from "../../../components/esteira/Esteira";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DadosDemanda from "./DadosDemanda";
import CriarEscalas from "./CriarEscalas";
import TipoContrato from "./TipoContrato";
import Finalizar from "./Finalizar";
import { fetchData, postData } from "../../../services/DataService";
import { useAlerta } from "../../../context/AlertaContext";
import dayjs from "dayjs";
import { useLayout } from "../../../layouts/Layout";

const CriarDemandas = () => {
  const { setTitulo, setActions } = useLayout();

  const navigate = useNavigate();
  const alerta = useAlerta();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventId = queryParams.get("eventId");

  const [step, setStep] = useState(0);
  const labels = ["Demanda", "Escalas", "Contrato", "Finalizar"];
  const qtdSteps = labels.length;

  const handleProximo = () => {
    if (step === qtdSteps - 1) handleConcluir();

    if (step > qtdSteps - 2) return;

    setStep(step + 1);
  };

  const handleConcluir = async () => {
    let request = {
      ...dadosDemanda,
      idEvento: dadosDemanda.evento.id,
      idResponsavel: dadosDemanda.responsavel?.id,
      tipoContrato: dadosDemanda.tipoContrato.id,
      escalas: dadosDemanda.escalas.map((escala) => {
        return { ...escala, funcaoEscala: escala.funcao.id };
      }),
    };

    const response = await postData("demandas", request);

    if (response.error) {
      console.error(response.data);
      alerta.error("Não foi possível criar demanda.");
      return;
    }

    alerta.success(`Demanda ${response.nome} criada com sucesso`);
    navigate(-1);
  };

  const handleAnterior = () => {
    if (step <= 0) return;

    setStep(step - 1);
  };

  const [dadosDemanda, setDadosDemanda] = useState({
    nome: "",
    inicio: dayjs().add(2, "day").startOf("day").subtract(12, "hours"),
    fim: dayjs().add(3, "day").startOf("day").subtract(12, "hours"),
    custoTotal: 0,
    responsavel: {
      id: "",
      nome: "",
    },
    tipoContrato: {
      id: "",
      value: "",
      documentosObrigatorios: [],
    },
    documentosAdicionados: [],
    evento: {
      id: "",
      value: "",
    },
    escalas: [],
  });

  const adicionarEscala = (novaEscala) => {
    novaEscala = {
      ...novaEscala,
      valor: Number(novaEscala.valor.replaceAll(".", "").replace(",", ".")),
    };

    setDadosDemanda((prevState) => ({
      ...prevState,
      escalas: [...prevState.escalas, novaEscala],
    }));
  };

  const handleDadosChange = (e, name) => {
    setDadosDemanda({ ...dadosDemanda, [name]: e.target.value });
  };

  useEffect(() => {
    setTitulo("");
    setActions(null);
  });

  const [eventos, setEventos] = useState([]);
  useEffect(() => {
    const buscarEvento = async () => {
      try {
        const data = await fetchData(`eventos`);
        setEventos(data);
      } catch (err) {
        //console.log("Erro ao buscar evento: " + err);
        alerta.error("Erro ao buscar evento");
      }
    };

    buscarEvento();
  }, []);

  const [responsaveis, setResponsaveis] = useState([]);
  useEffect(() => {
    const buscarResponsaveis = async () => {
      try {
        const data = await fetchData(`usuarios`);
        setResponsaveis(
          data
            .filter(
              (user) => user.contato !== null && user.tipoUsuario === "parceiro"
            )
            .map((user) => ({ ...user.contato, id: user.id }))
        );
      } catch (err) {
        console.error("Erro ao buscar responsáveis: " + err);
        alerta.error("Erro ao buscar responsáveis");
      }
    };

    buscarResponsaveis();
  }, []);

  useEffect(() => {
    if (!eventId) return;

    const evento = eventos.find((evento) => evento.id === eventId);

    if (!evento) return;

    setDadosDemanda((prevState) => ({
      ...prevState,
      evento: evento,
    }));
  }, [eventId, eventos]);

  const [erros, setErros] = useState([]);
  const [podeAvancar, setAvancar] = useState(true);

  const handleErros = (e) => {
    setErros((prevState) => ({
      ...prevState,
      [e.name]: e.value,
    }));
  };

  useEffect(() => {
    setAvancar(() => {
      const campos = Object.keys(erros);
      for (let i = 0; i < campos.length; i++) {
        if (erros[campos[i]]) {
          return true;
        }
      }

      return false;
    });
  }, [erros]);

  useEffect(() => {
    setErros([]);
  }, [step]);

  return (
    <>
      <PageModal>
        <Typography variant="h4" component="h4">
          Criar Demanda
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Grid container width="80%" margin="auto" columnSpacing={10}>
            <Grid display={"flex"} justifyContent={"center"} size={12}>
              <Esteira setStep={setStep} step={step} labels={labels} />
            </Grid>
            {step === 0 && (
              <DadosDemanda
                handleErros={handleErros}
                erros={erros}
                responsaveis={responsaveis}
                eventos={eventos}
                hasParams={eventId != null}
                handleDadosChange={handleDadosChange}
                dadosDemanda={dadosDemanda}
                setDadosDemanda={setDadosDemanda}
              />
            )}

            {step === 1 && (
              <CriarEscalas
                setDadosDemanda={setDadosDemanda}
                dadosDemanda={dadosDemanda}
                adicionarEscala={adicionarEscala}
                handleErros={handleErros}
                erros={erros}
              />
            )}

            {step === 2 && (
              <TipoContrato
                dadosDemanda={dadosDemanda}
                handleDadosChange={handleDadosChange}
                handleErros={handleErros}
                erros={erros}
              />
            )}

            {step === 3 && (
              <Finalizar
                dadosDemanda={dadosDemanda}
                setDadosDemanda={setDadosDemanda}
              />
            )}
          </Grid>
        </Box>
        <Box
          sx={{
            mt: "auto",
            alignSelf: "center",
            display: "flex",
            gap: 1,
            width: "40%",
          }}
        >
          <Botao
            onClick={step > 0 ? handleAnterior : () => navigate(-1)}
            sx={{ width: "100%", minWidth: 100 }}
            variant={step > 0 ? "outlined" : "contained"}
            color="primary"
            txt={step > 0 ? "Anterior" : "Cancelar"}
          />
          <Botao
            onClick={handleProximo}
            sx={{ width: "100%", minWidth: 100 }}
            disabled={!!podeAvancar}
            txt={step < qtdSteps - 1 ? "Próximo" : "Criar Demanda"}
          />
        </Box>
      </PageModal>
    </>
  );
};

export default CriarDemandas;
