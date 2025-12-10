import { PUBLIC_BACKEND } from "$env/static/public";
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: PUBLIC_BACKEND,
});

// Interceptor de requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ssh_token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    // Rejeita o erro para que o .catch() funcione
    return Promise.reject(error);
  }
);

// Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    return response.data.data; // Sucesso: retorna só os dados
  },
  (error: AxiosError<any>) => {
    // Extrai mensagem do backend (se existir)
    const data = JSON.parse(error.response!.data);

    // LANÇA UM ERRO para que o .catch() capture
    return Promise.reject({ ...data });
  }
);

export default api;
