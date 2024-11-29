const API_BASE_URL = 'http://127.0.0.1:21229';

const headers = {
  'Content-Type': 'application/json',
};


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

export function loginApi(email, password) {
  return apiRequest('/login', 'POST', { login: email, senha: password });
}

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