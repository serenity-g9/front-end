import axios from "axios";
import { patchData, urlData } from "./DataService";
import Cookies from 'js-cookie';

export const logar = async (dados) => {
  try {
    // Cookies.set("IP", window.location.hostname);

    const response = await axios.post(urlData + "usuarios/login", {
      email: dados.email,
      senha: dados.senha,
    });

    if (response.status !== 200) return;

    const { token, id, tipoUsuario, contato, imagem } = response.data;
    
    Cookies.set('TOKEN', token);
    Cookies.set("ID", id);
    Cookies.set("tipoUsuario", tipoUsuario);
    Cookies.set("nome", contato.nome);
    Cookies.set("profile_picture_url", imagem?.url);

    return response.data; 
  } catch (err) {
    //console.log(err.response.status);
  }
};

export const cadastrar = async (request) => {
  try {
    const response = await axios.post(urlData + 'usuarios/cadastro', request);

    return response;
  } catch (err) {
    return {
      error: true,
      message: err.response.data.message,
      data: err.response.data,
      status: err.response.status,
    };
  }
};

export const ativar = async (id) => {
  return await alterarAtivo(id, true);
}

export const desativar = async (id) => {
  return await alterarAtivo(id, false);
}

const alterarAtivo = async (id, ativo) => {
  return await patchData('usuarios', id, `alterar-ativo/${ativo}`);
};

