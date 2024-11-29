import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, TextField, Button, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Snackbar, Alert, CircularProgress, MenuItem
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import {
  createPedido, getPedidos, getPedidoById, updatePedido, deletePedido, getPratos, getClientes
} from '../../../../apis/requests';
import { useAuth } from '../../../../apis/AuthContext';

function PedidosPage() {
  const { userid } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pratos, setPratos] = useState([]);
  const [pedidoAtual, setPedidoAtual] = useState({
    cliente_id_cliente: '',
    entregador_id_entregador: '',
    usuarios_id_usuario: userid,
    pratos_id_prato: '',
    data_pedido: '',
    tempo_estimado: '',
  });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  
  const [searchCliente, setSearchCliente] = useState('');
  const [searchPrato, setSearchPrato] = useState('');

  useEffect(() => {
    carregarPedidos();
    carregarPratos();
    carregarClientes();
  }, []);

  const carregarPedidos = async () => {
    setLoading(true);
    try {
      const data = await getPedidos();
      setPedidos(data);
    } catch (error) {
      setError('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const carregarPratos = async () => {
    try {
      const data = await getPratos();
      setPratos(data);
    } catch (error) {
      setError('Erro ao carregar pratos');
    }
  };

  const carregarClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      setError('Erro ao carregar clientes');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (modoEdicao) {
        await updatePedido(pedidoId, pedidoAtual);
      } else {
        await createPedido(pedidoAtual);
      }
      setSuccess(modoEdicao ? 'Pedido atualizado com sucesso' : 'Pedido adicionado com sucesso');
      setPedidoAtual({
        cliente_id_cliente: '',
        entregador_id_entregador: '',
        usuarios_id_usuario: userid, 
        pratos_id_prato: '',
        data_pedido: '',
        tempo_estimado: '',
      });
      setModoEdicao(false);
      setPedidoId(null);
      carregarPedidos();
    } catch (error) {
      setError('Erro ao salvar pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const pedido = await getPedidoById(id);
      setPedidoAtual({
        ...pedido,
        usuarios_id_usuario: userid, 
      });
      setModoEdicao(true);
      setPedidoId(id);
    } catch (error) {
      setError('Erro ao carregar pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      setLoading(true);
      try {
        await deletePedido(id);
        setSuccess('Pedido excluído com sucesso');
        carregarPedidos();
      } catch (error) {
        setError('Erro ao excluir pedido');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPedidoAtual((prev) => ({ ...prev, [name]: value }));
  };

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchCliente.toLowerCase())
  );

  const filteredPratos = pratos.filter((prato) =>
    prato.nome.toLowerCase().includes(searchPrato.toLowerCase())
  );

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Gestão de Pedidos
        </Typography>
      </Box>

      {/* Snackbar for Error and Success */}
      {error && (
        <Snackbar open={true} autoHideDuration={6000}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
      {success && (
        <Snackbar open={true} autoHideDuration={6000}>
          <Alert severity="success">{success}</Alert>
        </Snackbar>
      )}

      {/* Formulário de Adicionar/Editar Pedido */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Buscar Cliente"
              value={searchCliente}
              onChange={(e) => setSearchCliente(e.target.value)}
              fullWidth
            />
            <TextField
              select
              label="Cliente"
              name="cliente_id_cliente"
              value={pedidoAtual.cliente_id_cliente}
              onChange={handleChange}
              fullWidth
              required
            >
              {filteredClientes.map((cliente) => (
                <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.nome}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Entregador ID"
              name="entregador_id_entregador"
              value={pedidoAtual.entregador_id_entregador}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Usuário ID"
              name="usuarios_id_usuario"
              value={userid}
              disabled 
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Buscar Prato"
              value={searchPrato}
              onChange={(e) => setSearchPrato(e.target.value)}
              fullWidth
            />
            <TextField
              select
              label="Prato"
              name="pratos_id_prato"
              value={pedidoAtual.pratos_id_prato}
              onChange={handleChange}
              fullWidth
              required
            >
              {filteredPratos.map((prato) => (
                <MenuItem key={prato.id_prato} value={prato.id_prato}>
                  {prato.nome}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Data do Pedido"
              name="data_pedido"
              type="datetime-local"
              value={pedidoAtual.data_pedido}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Tempo Estimado (minutos)"
              name="tempo_estimado"
              type="number"
              value={pedidoAtual.tempo_estimado}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (modoEdicao ? 'Atualizar Pedido' : 'Adicionar Pedido')}
          </Button>
        </Box>
      </Box>

      {/* Tabela de Pedidos */}
      <Typography variant="h6" gutterBottom>
        Lista de Pedidos
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Entregador ID</TableCell>
                <TableCell>Usuário ID</TableCell>
                <TableCell>Prato</TableCell>
                <TableCell>Data Pedido</TableCell>
                <TableCell>Tempo Estimado</TableCell>
                <TableCell>Entrega ID</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido.id_pedido}>
                  <TableCell>{pedido.cliente_nome}</TableCell>
                  <TableCell>{pedido.entregador_id_entregador}</TableCell>
                  <TableCell>{pedido.usuarios_id_usuario}</TableCell>
                  <TableCell>{pedido.prato_nome}</TableCell>
                  <TableCell>{new Date(pedido.data_pedido).toLocaleString()}</TableCell>
                  <TableCell>{pedido.tempo_estimado} min</TableCell>
                  <TableCell>{pedido.entrega_id_entrega}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(pedido.id_pedido)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(pedido.id_pedido)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default PedidosPage;
