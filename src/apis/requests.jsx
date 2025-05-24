const API_BASE_URL = 'https://controlfoodapi-d8a49e8667a8.herokuapp.com/api';

const headers = {
  'Content-Type': 'application/json',
};

const apiRequest = async (endpoint, method = 'GET', body = null) => {
  try {
    const options = {
      method,
      headers,
    };

    // Só adiciona body para métodos que aceitam corpo (POST, PUT, PATCH)
    if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    const responseText = await response.text();

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        console.error('Erro na requisição:', errorData);
        throw new Error(errorData.message || 'Erro na requisição');
      } catch {
        console.error('Erro na requisição:', responseText);
        throw new Error(responseText);
      }
    }

    try {
      return JSON.parse(responseText);
    } catch {
      return { message: responseText };
    }
  } catch (error) {
    console.error('Erro na apiRequest:', error);
    throw new Error(error.message || 'Erro desconhecido na API');
  }
};

// Autenticação
export const loginApi = (email, password) => {
  return apiRequest('/login', 'POST', { email: email, senha: password });
};

// Usuários
export const createUser = (data) => apiRequest('/usuarios', 'POST', data);
export const getUsers = () => apiRequest('/usuarios', 'GET');
export const getUserById = (id) => apiRequest(`/usuarios/${id}`, 'GET');
export const updateUser = (id, data) => apiRequest(`/usuarios/${id}`, 'PUT', data);
export const deleteUser = (id) => apiRequest(`/usuarios/${id}`, 'DELETE');

// Ingredientes
export const createIngrediente = (data) => apiRequest('/ingredientes', 'POST', data);
export const getIngredientes = () => apiRequest('/ingredientes', 'GET');
export const getIngredienteById = (id) => apiRequest(`/ingredientes/${id}`, 'GET');
export const updateIngrediente = (id, data) => apiRequest(`/ingredientes/${id}`, 'PUT', data);
export const deleteIngrediente = (id) => apiRequest(`/ingredientes/${id}`, 'DELETE');

// Histórico
export const createHistorico = (data) => apiRequest('/historico', 'POST', data);
export const getHistoricos = () => apiRequest('/historico', 'GET');
export const getHistoricoById = (id) => apiRequest(`/historico/${id}`, 'GET');
export const updateHistorico = (id, data) => apiRequest(`/historico/${id}`, 'PUT', data);
export const deleteHistorico = (id) => apiRequest(`/historico/${id}`, 'DELETE');

// Estoque
export const createEstoque = (data) => apiRequest('/estoque', 'POST', data);
export const getEstoques = () => apiRequest('/estoque', 'GET');
export const getEstoqueById = (id) => apiRequest(`/estoque/${id}`, 'GET');
export const updateEstoque = (id, data) => apiRequest(`/estoque/${id}`, 'PUT', data);
export const deleteEstoque = (id) => apiRequest(`/estoque/${id}`, 'DELETE');

// Pratos
export const createPrato = (data) => apiRequest('/pratos', 'POST', data);
export const getPratos = () => apiRequest('/pratos', 'GET');
export const getPratoById = (id) => apiRequest(`/pratos/${id}`, 'GET');
export const updatePrato = (id, data) => apiRequest(`/pratos/${id}`, 'PUT', data);
export const deletePrato = (id) => apiRequest(`/pratos/${id}`, 'DELETE');

// Clientes
export const createCliente = (data) => apiRequest('/clientes', 'POST', data);
export const getClientes = () => apiRequest('/clientes', 'GET');
export const getClienteById = (id) => apiRequest(`/clientes/${id}`, 'GET');
export const updateCliente = (id, data) => apiRequest(`/clientes/${id}`, 'PUT', data);
export const deleteCliente = (id) => apiRequest(`/clientes/${id}`, 'DELETE');

// Entregadores
export const getDeliverers = () => apiRequest('/entregadores', 'GET');
export const createDeliverer = (data) => apiRequest('/entregadores', 'POST', data);
export const updateDeliverer = (id, data) => apiRequest(`/entregadores/${id}`, 'PUT', data);
export const deleteDeliverer = (id) => apiRequest(`/entregadores/${id}`, 'DELETE');

// Entregas
export const createEntrega = (data) => apiRequest('/entrega', 'POST', data);
export const getEntregas = () => apiRequest('/entregas', 'GET');
export const getEntregaById = (id) => apiRequest(`/entregas/${id}`, 'GET');
export const updateEntrega = (id, data) => apiRequest(`/entregas/${id}`, 'PUT', data);
export const deleteEntrega = (id) => apiRequest(`/entregas/${id}`, 'DELETE');

// Pedidos
export const createPedido = (data) => apiRequest('/pedidos', 'POST', data);
export const getPedidos = () => apiRequest('/pedidos', 'GET');
export const getPedidoById = (id) => apiRequest(`/pedidos/${id}`, 'GET');
export const updatePedido = (id, data) => apiRequest(`/pedidos/${id}`, 'PUT', data);
export const deletePedido = (id) => apiRequest(`/pedidos/${id}`, 'DELETE');
