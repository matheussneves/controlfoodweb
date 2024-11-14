import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { createPedido, getPedidos, getPedidoById, updatePedido, deletePedido } from '../../../../apis/requests'; // Importa as funções de API

function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoAtual, setPedidoAtual] = useState({ nome: '', descricao: '', preco: '' });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Função para carregar os pedidos
  useEffect(() => {
    carregarPedidos();
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

  // Função para lidar com a submissão do formulário de novo pedido
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
      setPedidoAtual({ nome: '', descricao: '', preco: '' });
      setModoEdicao(false);
      setPedidoId(null);
      carregarPedidos();
    } catch (error) {
      setError('Erro ao salvar pedido');
    } finally {
      setLoading(false);
    }
  };

  // Função para editar um pedido
  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const pedido = await getPedidoById(id);
      setPedidoAtual(pedido);
      setModoEdicao(true);
      setPedidoId(id);
    } catch (error) {
      setError('Erro ao carregar pedido');
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir um pedido
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

  // Função para lidar com mudanças no formulário
  const handleChange = (event) => {
    const { name, value } = event.target;
    setPedidoAtual((prev) => ({ ...prev, [name]: value }));
  };

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
              label="Nome do Pedido"
              name="nome"
              value={pedidoAtual.nome}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Descrição"
              name="descricao"
              value={pedidoAtual.descricao}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Preço"
              name="preco"
              type="number"
              value={pedidoAtual.preco}
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
                <TableCell>Nome</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido.id_pedido}>
                  <TableCell>{pedido.nome}</TableCell>
                  <TableCell>{pedido.descricao}</TableCell>
                  <TableCell>{pedido.preco}</TableCell>
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
