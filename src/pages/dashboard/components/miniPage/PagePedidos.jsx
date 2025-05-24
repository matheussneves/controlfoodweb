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
    pratos_id_prato: [],
    data_pedido: '',
    tempo_estimado: '',
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
    } catch (err) {
      setError(`Erro ao carregar pedidos: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const carregarPratos = async () => {
    try {
      const data = await getPratos();
      setPratos(data);
    } catch (err) {
      setError(`Erro ao carregar pratos: ${err.message || 'Erro desconhecido'}`);
    }
  };

  const carregarClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (err) {
      setError(`Erro ao carregar clientes: ${err.message || 'Erro desconhecido'}`);
    }
  };

  const carregarDeliverers = async () => {
    try {
      const data = await getDeliverers();
      setDeliverers(data);
    } catch (err) {
      setError(`Erro ao carregar entregadores: ${err.message || 'Erro desconhecido'}`);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const endereco = clientes.find(c => c.id_cliente === pedidoAtual.cliente_id_cliente)?.endereco || 'Endereço não informado';

      const pratosArray = Array.isArray(pedidoAtual.pratos_id_prato)
        ? pedidoAtual.pratos_id_prato.map(id => ({ id_prato: id }))
        : [{ id_prato: pedidoAtual.pratos_id_prato }];

      const payload = {
        cliente_id_cliente: pedidoAtual.cliente_id_cliente,
        entregador_id_entregador: pedidoAtual.entregador_id_entregador,
        usuarios_id_usuario: userid,
        data_pedido: pedidoAtual.data_pedido,
        tempo_estimado: pedidoAtual.tempo_estimado || '30',
        entrega: {
          data_retirada: pedidoAtual.data_pedido,
          data_entrega: pedidoAtual.data_pedido,
          endereco
        },
        pratos: pratosArray
      };
      console.log('Payload:', payload);
      console.log('pedidoId', pedidoId);

      if (modoEdicao) {
        await updatePedido(pedidoId, payload);
        setSuccess('Pedido atualizado com sucesso');
      } else {
        await createPedido(payload);
        setSuccess('Pedido adicionado com sucesso');
      }

      setPedidoAtual({
        cliente_id_cliente: '',
        entregador_id_entregador: '',
        usuarios_id_usuario: userid,
        pratos_id_prato: [],
        data_pedido: '',
        tempo_estimado: '',
        status: '',
      });
      setModoEdicao(false);
      setPedidoId(null);
      carregarPedidos();
      setModoEdicao(true);
    } catch (err) {
      console.error('Erro ao salvar pedido:', err);
      setError(`Erro ao salvar pedido: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'pratos_id_prato') {
      const selected = Array.isArray(value) ? value : [value];
      const pratoSelecionado = pratos.find((prato) => prato.id_prato === selected[0]);
      const tempoEstimado = pratoSelecionado ? pratoSelecionado.tempo : '';

      setPedidoAtual((prev) => ({
        ...prev,
        pratos_id_prato: selected,
        tempo_estimado: tempoEstimado,
      }));
    } else {
      setPedidoAtual((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const pedido = pedidos.find(p => p.id_pedido === id);
      const pratos = pedido.pratos.map(p => p.id_prato);

      setPedidoAtual({
        cliente_id_cliente: pedido.cliente_id_cliente,
        entregador_id_entregador: pedido.entregador_id_entregador,
        usuarios_id_usuario: userid,
        pratos_id_prato: pratos,
        data_pedido: pedido.data_pedido,
        tempo_estimado: pedido.tempo_estimado,
        status: pedido.status,
      });
      setModoEdicao(true);
      setPedidoId(id);
    } catch (err) {
      console.error('Erro ao carregar pedido:', err);
      setError(`Erro ao carregar pedido: ${err.message || 'Erro desconhecido'}`);
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
      } catch (err) {
        console.error('Erro ao excluir pedido:', err);
        setError(`Erro ao excluir pedido: ${err.message || 'Erro desconhecido'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>Gestão de Pedidos</Typography>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
      </Snackbar>
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>
      </Snackbar>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, p: 3, bgcolor: '#fafafa', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {modoEdicao ? 'Editar Pedido' : 'Novo Pedido'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Cliente"
              select
              name="cliente_id_cliente"
              fullWidth
              required
              value={pedidoAtual.cliente_id_cliente}
              onChange={handleChange}
              size="small"
            >
              {clientes.map((cliente) => (
                
                <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>{cliente.nome}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Entregador"
              select
              name="entregador_id_entregador"
              fullWidth
              required
              value={pedidoAtual.entregador_id_entregador}
              onChange={handleChange}
              size="small"
            >
              {deliverers.map((entregador) => (
                
                <MenuItem key={entregador.id_entregador} value={entregador.id_entregador}>{entregador.nome}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Data do Pedido"
              type="datetime-local"
              name="data_pedido"
              fullWidth
              required
              value={pedidoAtual.data_pedido}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Pratos"
              select
              name="pratos_id_prato"
              fullWidth
              required
              SelectProps={{ multiple: true }}
              value={pedidoAtual.pratos_id_prato}
              onChange={handleChange}
              size="small"
            >
              {pratos.map((prato) => (
                <MenuItem key={prato.id_prato} value={prato.id_prato}>{prato.nome}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ minWidth: 180 }}
          >
            {loading ? <CircularProgress size={24} /> : (modoEdicao ? 'Atualizar Pedido' : 'Adicionar Pedido')}
          </Button>
          {modoEdicao && (
            <Button
              sx={{ ml: 2 }}
              variant="outlined"
              color="secondary"
              onClick={() => {
                setModoEdicao(false);
                setPedidoAtual({
                  cliente_id_cliente: '',
                  entregador_id_entregador: '',
                  usuarios_id_usuario: userid,
                  pratos_id_prato: [],
                  data_pedido: '',
                  tempo_estimado: '',
                  status: '',
                });
                setPedidoId(null);
              }}
            >
              Cancelar
            </Button>
          )}
        </Box>
      </Box>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Pedidos Cadastrados</Typography>
        <TableContainer sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Entregador</TableCell>
                <TableCell>Pratos</TableCell>
                <TableCell>Data</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum pedido cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                pedidos.map((pedido) => (
                  <TableRow key={pedido.id_pedido}>
                    <TableCell>{pedido.nome_cliente}</TableCell>
                    <TableCell>{pedido.nome_entregador}</TableCell>
                    <TableCell>
                      {Array.isArray(pedido.pratos)
                        ? pedido.pratos.map((p) => p.nome).join(', ')
                        : pedido.prato?.nome || '-'}
                    </TableCell>
                    <TableCell>
                      {pedido.data_pedido
                        ? new Date(pedido.data_pedido).toLocaleString('pt-BR')
                        : '-'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleEdit(pedido.id_pedido)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(pedido.id_pedido)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default PedidosPage;
