// api.js

const API_BASE_URL = 'http://127.0.0.1:8080';

export async function loginApi(email, password) {
  // Cria o objeto de cabeçalho
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  // Cria o corpo da requisição em formato JSON
  const raw = JSON.stringify({
    login: email,
    senha: password

  });

  // Configura as opções da requisição
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw
  };
  
  
    // Faz a requisição utilizando as opções configuradas
    const response = await fetch(`${API_BASE_URL}/login`, requestOptions);

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message + raw || 'Erro ao fazer login');
    }

    // Retorna o resultado em formato JSON
    return await response.json();

}
