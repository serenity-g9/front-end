import React, { useEffect, useState } from "react";
import { cadastrar } from "../services/UsuarioService";
import CampoTexto from "../components/input/CampoTexto";
import Botao from "../components/btn/Botao";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useAlerta } from "../context/AlertaContext";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid2,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import imagemFundo from "../assets/Cadastro.png";
import { Password } from "@mui/icons-material";
import CallIcon from "@mui/icons-material/Call";
import BadgeIcon from "@mui/icons-material/Badge";
import { emailRegex } from "../utils/util";
import { useLayout } from "../layouts/Layout";
import { DatePicker } from "@mui/x-date-pickers";

const Cadastro = () => {
  const { setTitulo, setActions } = useLayout();

  const { login } = useUser();
  const navigate = useNavigate();

  const alerta = useAlerta();

  useEffect(() => {
    setTitulo("");
    setActions(null);
  }, [setTitulo, setActions]);

  const [loading, setLoading] = useState(false);

  const [dados, setDados] = useState({
    email: "",
    senha: "",
    tipoUsuario: 1,
    contato: {
      nome: "",
      celular: "",
      cpf: "",
      dataNascimento: "",
    },
  });

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const handleContatoChange = (e) => {
    const contatoNovo = dados.contato;
    contatoNovo[e.target.name] = e.target.value;

    setDados({ ...dados, contato: contatoNovo });
  };

  const handleDataNascimentoChange = (e) => {
    const contatoNovo = dados.contato;
    contatoNovo.dataNascimento = e?.toISOString()?.split("T")[0];

    setDados({ ...dados, contato: contatoNovo });
  };

  const handleCadastrar = async () => {
    setLoading(true);

    setTimeout(async () => {
      try {
        const request = {
          ...dados,
          contato: {
            ...dados.contato,
            cpf: dados.contato.cpf.replace(/\D/g, ""),
            celular: dados.contato.celular.replace(/\D/g, ""),
          },
        };

        const response = await cadastrar(request);

        if (response.error) {
          alerta.error("Não foi possivel realizar o cadastro");
          return;
        }

        alerta.success("Cadastro realizado com sucesso");
        navigate("/login");
      } catch (err) {
        alerta.error("Não foi possivel realizar o cadastro");
        //console.log(err);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <Box
      className="flexRowCenter"
      height="100vh"
      sx={{
        backgroundImage: `url(${imagemFundo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          bgcolor: "#ffffff",
          width: {
            xs: "100%",
            sm: 900,
          },
          height: {
            xs: "100vh",
            sm: "auto",
          },

          left: {
            xs: 0,
            sm: 140,
          },
          p: {
            xs: 8,
            sm: 4,
          },
          borderRadius: {
            xs: 0,
            sm: 3,
          },
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "normal",
            mb: 6,
            fontSize: "41px",
            marginRight: "10px",
            marginTop: "-2px",
            ml: 0,
          }}
        >
          <b>Cadastrar</b>
        </Typography>

        <Grid2 container size={12}>
          <Grid2
            item
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                mb: 0,
                color: "#182F4E",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Nome:
            </Typography>
            <CampoTexto
              size={12}
              sx={{ pr: 2, pl: 2, mb: 3 }}
              placeholder={"Nome"}
              name="nome"
              value={dados.contato.nome}
              handleChange={handleContatoChange}
              startAdornment={<PersonIcon />}
              borderRadius={"9px"}
            />

            <Typography
              variant="subtitle1"
              sx={{
                mb: 0,
                color: "#182F4E",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              E-mail:
            </Typography>
            <CampoTexto
              size={12}
              sx={{ pr: 2, pl: 2, mb: 3 }}
              placeholder={"Endereço de e-mail"}
              name="email"
              value={dados.email}
              handleChange={handleChange}
              startAdornment={<EmailIcon />}
              borderRadius={"9px"}
              regex={emailRegex}
              defaultMessage={"E-mail inválido"}
            />

            <Typography
              variant="subtitle1"
              sx={{
                mb: 0,
                color: "#182F4E",
                fontWeight: "bold",
                marginTop: "5px",
                marginBottom: "5px",
              }}
            >
              Senha:
            </Typography>
            <CampoTexto
              size={12}
              sx={{ pr: 2, pl: 2, mb: 3 }}
              borderRadius="6px"
              placeholder={"Senha"}
              name="senha"
              value={dados.senha}
              handleChange={handleChange}
              type="password"
              startAdornment={<LockIcon />}
            />
          </Grid2>
          <Grid2
            item
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                mb: 0,
                color: "#182F4E",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Celular:
            </Typography>
            <CampoTexto
              size={12}
              sx={{ pr: 2, pl: 2, mb: 3 }}
              placeholder={"Celular"}
              name="celular"
              mascara="celular"
              value={dados.contato.celular}
              handleChange={handleContatoChange}
              startAdornment={<CallIcon />}
              borderRadius={"9px"}
            />

            <Typography
              variant="subtitle1"
              sx={{
                mb: 0,
                color: "#182F4E",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              CPF:
            </Typography>
            <CampoTexto
              size={12}
              sx={{ pr: 2, pl: 2, mb: 3 }}
              placeholder={"CPF"}
              name="cpf"
              mascara="cpf"
              value={dados.contato.cpf}
              handleChange={handleContatoChange}
              startAdornment={<BadgeIcon />}
              borderRadius={"9px"}
            />

            <Typography
              variant="subtitle1"
              sx={{
                mb: 0,
                color: "#182F4E",
                fontWeight: "bold",
                marginTop: "5px",
                marginBottom: "5px",
              }}
            >
              Data de nascimento:
            </Typography>
            <Grid2 size={12} item>
              <DatePicker
                onChange={handleDataNascimentoChange}
                slotProps={{ textField: { fullWidth: true } }}
                sx={{ mt: 2, ml: 2, pr: 4 }}
              />
            </Grid2>
          </Grid2>
        </Grid2>

        {/* <FormControl sx={{ display: "flex", alignItems: "center" }}>
          <FormLabel id="demo-radio-buttons-group-label"></FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={0}
            name="tipoUsuario"
            onChange={handleChange}
          >
            <FormControlLabel
              value={0}
              control={<Radio color="secondary" />}
              label="CNPJ"
            />
            <FormControlLabel
              value={1}
              control={<Radio color="secondary" />}
              label="CPF"
            />
          </RadioGroup>
        </FormControl> */}

        <Box sx={{ height: "17%" }} mt={4} className="flexRowCenter">
          {!loading ? (
            <Botao
              sx={{
                width: "100%",
                height: "60px",
                textTransform: "none",
                borderRadius: "12px",
                marginTop: "0px",
              }}
              txt="Cadastrar"
              color="primary"
              onClick={handleCadastrar}
            />
          ) : (
            <CircularProgress color="secondary" />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Cadastro;
