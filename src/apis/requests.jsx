const API_BASE_URL = 'http://127.0.0.1:21229';

const headers = {
  'Content-Type': 'application/json',
};

// Função genérica para lidar com requisições de API
async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro na requisição');
  }

  return await response.json();
}

// Funções para Login
export function loginApi(email, password) {
  return apiRequest('/login', 'POST', { login: email, senha: password });
}

// Funções para Usuários
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

// Funções para Ingredientes
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

// Funções para Histórico de Entrada
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

// Funções para Estoque
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

// Funções para Pratos
export function createPrato(data) {
  return apiRequest('/pratos', 'POST', data);
}

export function getPratos() {
  return apiRequest('/pratos', 'GET');
}

export function getPratoById(id) {
  return apiRequest(`/pratos/${id}`, 'GET');
}

export function updatePrato(id, data) {
  return apiRequest(`/pratos/${id}`, 'PUT', data);
}

export function deletePrato(id) {
  return apiRequest(`/pratos/${id}`, 'DELETE');
}

// Funções para Clientes
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

export function createDeliverer(data) {
  return apiRequest('/entregadores', 'POST', data);
}

export function getDeliverers() {
  return apiRequest('/entregadores', 'GET');
}

export function getDelivererById(id) {
  return apiRequest(`/entregadores/${id}`, 'GET');
}

export function updateDeliverer(id, data) {
  return apiRequest(`/entregadores/${id}`, 'PUT', data);
}

export function deleteDeliverer(id) {
  return apiRequest(`/entregadores/${id}`, 'DELETE');
}

export function createEntrega(data) {
  return apiRequest('/entrega', 'POST', data);
}

export function getEntregas() {
  return apiRequest('/entrega', 'GET');
}

export function getEntregaById(id) {
  return apiRequest(`/entrega/${id}`, 'GET');
}

export function updateEntrega(id, data) {
  return apiRequest(`/entrega/${id}`, 'PUT', data);
}

export function deleteEntrega(id) {
  return apiRequest(`/entrega/${id}`, 'DELETE');
}

export function createPedido(data) {
  return apiRequest('/entrega', 'POST', data);
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