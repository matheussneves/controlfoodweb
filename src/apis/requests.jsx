const API_BASE_URL = 'https://controlfoodapi-d8a49e8667a8.herokuapp.com';

const headers = {
  'Content-Type': 'application/json',
};

async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
    let errorText = await response.text();
    throw new Error(errorText);
  }
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  } else {
    return await response.text();
  };
  } catch (error) {
    console.error('Erro ao fazer requisição:', error);
    throw error;
  }
}

// Autenticação
export function loginApi(email, password) {
  return apiRequest('/login', 'POST', { login: email, senha: password });
}

// Usuários
export function createUser(data) {
  return apiRequest('/usuarios', 'POST', data);
}
export function getUsers() {
  return apiRequest('/usuarios', 'GET');
}
export function getUserById(id) {
  return apiRequest(`/usuarios/${id}`, 'GET');
}
export function updateUser(id, data) {
  return apiRequest(`/usuarios/${id}`, 'PUT', data);
}
export function deleteUser(id) {
  return apiRequest(`/usuarios/${id}`, 'DELETE');
}

// Ingredientes (POST retorna texto)
export function createIngrediente(data) {
  return apiRequest('/ingredientes', 'POST', data);
}
export function getIngredientes() {
  return apiRequest('/ingredientes', 'GET');
}
export function getIngredienteById(id) {
  return apiRequest(`/ingredientes/${id}`, 'GET');
}
export function updateIngrediente(id, data) {
  return apiRequest(`/ingredientes/${id}`, 'PUT', data);
}
export function deleteIngrediente(id) {
  return apiRequest(`/ingredientes/${id}`, 'DELETE');
}

// Histórico
export function createHistorico(data) {
  return apiRequest('/historico', 'POST', data);
}
export function getHistoricos() {
  return apiRequest('/historico', 'GET');
}
export function getHistoricoById(id) {
  return apiRequest(`/historico/${id}`, 'GET');
}
export function updateHistorico(id, data) {
  return apiRequest(`/historico/${id}`, 'PUT', data);
}
export function deleteHistorico(id) {
  return apiRequest(`/historico/${id}`, 'DELETE');
}

// Estoque
export function createEstoque(data) {
  return apiRequest('/estoque', 'POST', data);
}
export function getEstoques() {
  return apiRequest('/estoque', 'GET');
}
export function getEstoqueById(id) {
  return apiRequest(`/estoque/${id}`, 'GET');
}
export function updateEstoque(id, data) {
  return apiRequest(`/estoque/${id}`, 'PUT', data);
}
export function deleteEstoque(id) {
  return apiRequest(`/estoque/${id}`, 'DELETE');
}

// Pratos

// Criar prato
export function createPrato(data) {
  // data deve ser: { nome, descricao, preco, tempo, ingredientes: [{ id_ingrediente, quantidade, medida }] }
  return apiRequest('/pratos', 'POST', data);
}

// Listar todos os pratos
export function getPratos() {
  return apiRequest('/pratos', 'GET');
}

// Buscar prato por ID
export function getPratoById(id) {
  return apiRequest(`/pratos/${id}`, 'GET');
}

// Atualizar prato por ID
export function updatePrato(id, data) {
  // data deve ser: { nome, descricao, preco, tempo, ingredientes: [{ id_ingrediente, quantidade, medida }] }
  return apiRequest(`/pratos/${id}`, 'PUT', data);
}

// Remover prato por ID
export function deletePrato(id) {
  return apiRequest(`/pratos/${id}`, 'DELETE');
}
// Clientes
export function createCliente(data) {
  return apiRequest('/clientes', 'POST', data);
}
export function getClientes() {
  return apiRequest('/clientes', 'GET');
}
export function getClienteById(id) {
  return apiRequest(`/clientes/${id}`, 'GET');
}
export function updateCliente(id, data) {
  return apiRequest(`/clientes/${id}`, 'PUT', data);
}
export function deleteCliente(id) {
  return apiRequest(`/clientes/${id}`, 'DELETE');
}

// Entregadores
export const getDeliverers = async () => {
  return apiRequest('/entregadores', 'GET');
};

export const createDeliverer = async (data) => {
  return apiRequest('/entregadores', 'POST', data);
};

export const updateDeliverer = async (id, data) => {
  return apiRequest(`/entregadores/${id}`, 'PUT', data);
};

export const deleteDeliverer = async (id) => {
  return apiRequest(`/entregadores/${id}`, 'DELETE');
};

// Entregas
export function createEntrega(data) {
  return apiRequest('/entrega', 'POST', data);
}
export function getEntregas() {
  return apiRequest('/entregas', 'GET');
}
export function getEntregaById(id) {
  return apiRequest(`/entregas/${id}`, 'GET');
}
export function updateEntrega(id, data) {
  return apiRequest(`/entregas/${id}`, 'PUT', data);
}
export function deleteEntrega(id) {
  return apiRequest(`/entregas/${id}`, 'DELETE');
}

// Pedidos
export function createPedido(data) {
  return apiRequest('/pedidos', 'POST', data);
}
export function getPedidos() {
  return apiRequest('/pedidos', 'GET');
}
export function getPedidoById(id) {
  return apiRequest(`/pedidos/${id}`, 'GET');
}
export function updatePedido(id, data) {
  return apiRequest(`/pedidos/${id}`, 'PUT', data);
}
export function deletePedido(id) {
  return apiRequest(`/pedidos/${id}`, 'DELETE');
}
