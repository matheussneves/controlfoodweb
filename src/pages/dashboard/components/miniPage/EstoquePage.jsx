import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import {
  createEstoque,
  getEstoques,
  getEstoqueById,
  updateEstoque,
  deleteEstoque,
  getIngredientes,
} from '../../../../apis/requests';

function EstoquePage() {
  const [estoques, setEstoques] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [estoqueAtual, setEstoqueAtual] = useState({
    ingrediente_Id_ingrediente: '',
    quantidade: '',
    medida: '',
    quantidade_minima: '',
  });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [estoqueId, setEstoqueId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    carregarEstoques();
    carregarIngredientes();
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

  const carregarIngredientes = async () => {
    try {
      const data = await getIngredientes();
      setIngredientes(data);
    } catch (error) {
      setError('Erro ao carregar ingredientes');
    }
  };

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
      setEstoqueAtual({ ingrediente_Id_ingrediente: '', quantidade: '', medida: '', quantidade_minima: '' });
      setModoEdicao(false);
      setEstoqueId(null);
      carregarEstoques();
    } catch (error) {
      setError('Erro ao salvar estoque');
    } finally {
      setLoading(false);
    }
  };

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEstoqueAtual((prev) => ({ ...prev, [name]: value }));
  };

  const getDescricaoIngrediente = (ingredienteId) => {
    const ingrediente = ingredientes.find((ing) => ing.Id_ingrediente === ingredienteId);
    return ingrediente ? ingrediente.descricao : 'Não encontrado';
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Gestão de Estoque
        </Typography>
      </Box>

      {/* Snackbar para erros e sucesso */}
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
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Ingrediente"
              name="ingrediente_Id_ingrediente"
              value={estoqueAtual.ingrediente_Id_ingrediente}
              onChange={handleChange}
              fullWidth
              required
            >
              {ingredientes.map((ingrediente) => (
                <MenuItem key={ingrediente.Id_ingrediente} value={ingrediente.Id_ingrediente}>
                  {ingrediente.descricao}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={3}>
            <TextField
              label="Medida"
              name="medida"
              value={estoqueAtual.medida}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Quantidade Mínima"
              name="quantidade_minima"
              type="number"
              value={estoqueAtual.quantidade_minima}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : modoEdicao ? 'Atualizar Item' : 'Adicionar Item'}
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
                <TableCell>Descrição</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Medida</TableCell>
                <TableCell>Quantidade Mínima</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estoques.map((estoque) => (
                <TableRow key={estoque.id_estoque}>
                  <TableCell>{getDescricaoIngrediente(estoque.ingrediente_Id_ingrediente)}</TableCell>
                  <TableCell>{estoque.quantidade}</TableCell>
                  <TableCell>{estoque.medida}</TableCell>
                  <TableCell>{estoque.quantidade_minima}</TableCell>
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
