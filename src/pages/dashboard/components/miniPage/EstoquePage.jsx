import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { createEstoque, getEstoques, getEstoqueById, updateEstoque, deleteEstoque } from '../../../../apis/requests'; // Importa as funções de API para estoque

function EstoquePage() {
  const [estoques, setEstoques] = useState([]);
  const [estoqueAtual, setEstoqueAtual] = useState({ item: '', quantidade: '', preco: '' });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [estoqueId, setEstoqueId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Função para carregar o estoque
  useEffect(() => {
    carregarEstoques();
  }, []);

  const carregarEstoques = async () => {
    setLoading(true);
    try {
      const data = await getEstoques();
      setEstoques(data);
    } catch (error) {
      setError('Erro ao carregar estoques');
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com a submissão do formulário de novo item de estoque
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (modoEdicao) {
        await updateEstoque(estoqueId, estoqueAtual);
      } else {
        await createEstoque(estoqueAtual);
      }
      setSuccess(modoEdicao ? 'Item atualizado com sucesso' : 'Item adicionado com sucesso');
      setEstoqueAtual({ item: '', quantidade: '', preco: '' });
      setModoEdicao(false);
      setEstoqueId(null);
      carregarEstoques();
    } catch (error) {
      setError('Erro ao salvar estoque');
    } finally {
      setLoading(false);
    }
  };

  // Função para editar um item de estoque
  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const estoque = await getEstoqueById(id);
      setEstoqueAtual(estoque);
      setModoEdicao(true);
      setEstoqueId(id);
    } catch (error) {
      setError('Erro ao carregar estoque');
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir um item de estoque
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      setLoading(true);
      try {
        await deleteEstoque(id);
        setSuccess('Item excluído com sucesso');
        carregarEstoques();
      } catch (error) {
        setError('Erro ao excluir item');
      } finally {
        setLoading(false);
      }
    }
  };

  // Função para lidar com mudanças no formulário
  const handleChange = (event) => {
    const { name, value } = event.target;
    setEstoqueAtual((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Gestão de Estoque
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

      {/* Formulário de Adicionar/Editar Estoque */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Item"
              name="item"
              value={estoqueAtual.item}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Quantidade"
              name="quantidade"
              type="number"
              value={estoqueAtual.quantidade}
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
              value={estoqueAtual.preco}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (modoEdicao ? 'Atualizar Item' : 'Adicionar Item')}
          </Button>
        </Box>
      </Box>

      {/* Tabela de Estoques */}
      <Typography variant="h6" gutterBottom>
        Lista de Estoques
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estoques.map((estoque) => (
                <TableRow key={estoque.id_estoque}>
                  <TableCell>{estoque.item}</TableCell>
                  <TableCell>{estoque.quantidade}</TableCell>
                  <TableCell>{estoque.preco}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(estoque.id_estoque)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(estoque.id_estoque)}>
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

export default EstoquePage;
