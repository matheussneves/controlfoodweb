import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, TextField, Button, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Snackbar, Alert, CircularProgress, MenuItem
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import {
  createPedido, getPedidos, getPedidoById, updatePedido, deletePedido, getPratos, getClientes, getDeliverers
} from '../../../../apis/requests';
import { useAuth } from '../../../../apis/AuthContext';

function PedidosPage() {
  const { userid } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pratos, setPratos] = useState([]);
  const [deliverers, setDeliverers] = useState([]);
  const [pedidoAtual, setPedidoAtual] = useState({
    cliente_id_cliente: '',
    entregador_id_entregador: '',
    usuarios_id_usuario: userid,
    pratos_id_prato: '',
    data_pedido: '',
    tempo_estimado: '',
    entrega_id_entrega: '',
    status: '',
  });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [searchCliente, setSearchCliente] = useState('');
  const [searchPrato, setSearchPrato] = useState('');
  const [searchEntregador, setSearchEntregador] = useState('');

  useEffect(() => {
    carregarPedidos();
    carregarPratos();
    carregarClientes();
    carregarDeliverers();
  }, []);

  useEffect(() => {
    const agora = new Date();
    const localDatetime = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    setPedidoAtual((prev) => ({
      ...prev,
      data_pedido: localDatetime,
    }));
  }, []);

  const carregarPedidos = async () => {
    setLoading(true);
    try {
      const data = await getPedidos();
      setPedidos(data);
    } catch {
      setError('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const carregarPratos = async () => {
    try {
      const data = await getPratos();
      setPratos(data);
    } catch {
      setError('Erro ao carregar pratos');
    }
  };

  const carregarClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch {
      setError('Erro ao carregar clientes');
    }
  };

  const carregarDeliverers = async () => {
    try {
      const data = await getDeliverers();
      setDeliverers(data);
    } catch {
      setError('Erro ao carregar entregadores');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!pedidoAtual.entrega_id_entrega) {
        pedidoAtual.entrega_id_entrega = `ENT-${Math.floor(Math.random() * 10000)}`;
      }

      console.log('🟢 Enviando pedido:', pedidoAtual);

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
        entrega_id_entrega: '',
        status: '',
      });
      setModoEdicao(false);
      setPedidoId(null);
      carregarPedidos();
    } catch {
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
    } catch {
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
      } catch {
        setError('Erro ao excluir pedido');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'pratos_id_prato') {
      const pratoSelecionado = pratos.find((prato) => prato.id_prato === value);
      const tempoEstimado = pratoSelecionado ? pratoSelecionado.tempo_preparo : '';
      setPedidoAtual((prev) => ({
        ...prev,
        pratos_id_prato: value,
        tempo_estimado: tempoEstimado,
      }));
    } else {
      setPedidoAtual((prev) => ({ ...prev, [name]: value }));
    }
  };

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchCliente.toLowerCase())
  );

  const filteredPratos = pratos.filter((prato) =>
    prato.nome.toLowerCase().includes(searchPrato.toLowerCase())
  );

  const filteredEntregadores = deliverers.filter((deliverer) =>
    deliverer.nome.toLowerCase().includes(searchEntregador.toLowerCase())
  );

  return (
    <Container>
      <Box my={6}>
        <Typography variant="h4" gutterBottom>Gestão de Pedidos</Typography>
      </Box>

      {error && <Snackbar open autoHideDuration={6000}><Alert severity="error">{error}</Alert></Snackbar>}
      {success && <Snackbar open autoHideDuration={6000}><Alert severity="success">{success}</Alert></Snackbar>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Cadastrar Pedido</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Cliente" select name="cliente_id_cliente" fullWidth required
              value={pedidoAtual.cliente_id_cliente}
              onChange={handleChange}
            >
              {filteredClientes.map((cliente) => (
                <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>{cliente.nome}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Entregador" select name="entregador_id_entregador" fullWidth required
              value={pedidoAtual.entregador_id_entregador || ''}
              onChange={handleChange}
            >
              {deliverers.map((deliverer) => (
                <MenuItem key={deliverer.id_entregador} value={deliverer.id_entregador}>{deliverer.nome}</MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <TextField
              label="Data do Pedido" type="datetime-local" name="data_pedido" fullWidth required
              value={pedidoAtual.data_pedido}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
        
          
        </Grid>
        <Box mt={2}>
        <Grid item xs={12} sm={3}>
            <TextField
              label="Pratos"
              select
              name="pratos_id_prato"
              fullWidth
              required
              SelectProps={{ multiple: true }}
              value={pedidoAtual.pratos_id_prato || []}
              onChange={handleChange}
            >
              {filteredPratos.map((prato) => (
                <MenuItem key={prato.id_prato} value={prato.id_prato}>{prato.nome}</MenuItem>
              ))}
            </TextField>
            
          </Grid>
          </Box>
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (modoEdicao ? 'Atualizar Pedido' : 'Adicionar Pedido')}
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Buscar Pedido</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField label="Buscar Cliente" fullWidth value={searchCliente} onChange={(e) => setSearchCliente(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Buscar Prato" fullWidth value={searchPrato} onChange={(e) => setSearchPrato(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Buscar Entregador" fullWidth value={searchEntregador} onChange={(e) => setSearchEntregador(e.target.value)} />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Entregador</TableCell>
                <TableCell>Prato</TableCell>
                <TableCell>Data do Pedido</TableCell>
                <TableCell>Tempo Estimado</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido.id_pedido}>
                  <TableCell>{pedido.cliente?.nome}</TableCell>
                  <TableCell>{pedido.entregador?.nome}</TableCell>
                  <TableCell>
                    {Array.isArray(pedido.prato)
                      ? pedido.prato.map((p) => p.nome).join(', ')
                      : pedido.prato?.nome}
                  </TableCell>
                  <TableCell>{pedido.data_pedido}</TableCell>
                  <TableCell>{pedido.tempo_estimado}</TableCell>
                  <TableCell>{pedido.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(pedido.id_pedido)} color="primary"><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(pedido.id_pedido)} color="secondary"><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default PedidosPage;
