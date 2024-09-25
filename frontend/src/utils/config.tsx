export const api = "http://localhost:5000/api";
export const uploads = "http://localhost:5000/uploads";

export const requestConfig = (
  method: string,
  data: any,
  token: string | null,
  image: boolean
) => {
  let config: {
    method: string;
    headers: {
      "Content-Type"?: string;
      Authorization?: string;
    };
    body?: any;
  };

  // Configuração para requisição com envio de imagem
  if (image) {
    config = {
      method,
      body: data, // FormData já inclui a imagem
      headers: {}, // Sem Content-Type aqui, o navegador define automaticamente
    };
  } else if (method === "DELETE" || data === null) {
    // Configuração para DELETE ou sem dados
    config = {
      method,
      headers: {},
    };
  } else {
    // Configuração para requisição com JSON
    try {
      config = {
        method,
        body: JSON.stringify(data), // Converter data para JSON
        headers: {
          "Content-Type": "application/json",
        },
      };
    } catch (error) {
      console.error("Erro ao serializar dados para JSON:", error);
      throw new Error("Falha ao preparar a requisição");
    }
  }

  // Adicionar o token ao cabeçalho, se existir
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};
