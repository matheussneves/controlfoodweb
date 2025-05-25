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
    <Container id="estoque-page-container">
      <Box id="estoque-page-header" my={4}>
        <Typography id="estoque-page-title" variant="h4" gutterBottom>
          Gestão de Estoque
        </Typography>
      </Box>

      {/* Snackbar para erros e sucesso */}
      {error && (
        <Snackbar id="estoque-page-error-snackbar" open={true} autoHideDuration={6000}>
          <Alert id="estoque-page-error-alert" severity="error">{error}</Alert>
        </Snackbar>
      )}
      {success && (
        <Snackbar id="estoque-page-success-snackbar" open={true} autoHideDuration={6000}>
          <Alert id="estoque-page-success-alert" severity="success">{success}</Alert>
        </Snackbar>
      )}

      {/* Formulário de Adicionar/Editar Estoque */}
      <Box
        id="estoque-page-form"
        component="form"
        onSubmit={handleSubmit}
        sx={{ mb: 4 }}
      >
        <Grid id="estoque-page-form-grid" container spacing={2}>
          <Grid id="estoque-page-form-ingrediente" item xs={12} sm={6}>
            <TextField
              id="estoque-page-form-ingrediente-select"
              select
              label="Ingrediente"
              name="ingrediente_Id_ingrediente"
              value={estoqueAtual.ingrediente_Id_ingrediente}
              onChange={handleChange}
              fullWidth
              required
            >
              {ingredientes.map((ingrediente) => (
                <MenuItem
                  id={`estoque-page-form-ingrediente-option-${ingrediente.Id_ingrediente}`}
                  key={ingrediente.Id_ingrediente}
                  value={ingrediente.Id_ingrediente}
                >
                  {ingrediente.descricao}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid id="estoque-page-form-quantidade" item xs={12} sm={3}>
            <TextField
              id="estoque-page-form-quantidade-input"
              label="Quantidade"
              name="quantidade"
              type="number"
              value={estoqueAtual.quantidade}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid id="estoque-page-form-medida" item xs={12} sm={3}>
            <TextField
              id="estoque-page-form-medida-input"
              label="Medida"
              name="medida"
              value={estoqueAtual.medida}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid id="estoque-page-form-quantidade-minima" item xs={12} sm={3}>
            <TextField
              id="estoque-page-form-quantidade-minima-input"
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
        <Box id="estoque-page-form-submit-box" mt={2}>
          <Button
            id="estoque-page-form-submit-button"
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress id="estoque-page-form-loading" size={24} /> : modoEdicao ? 'Atualizar Item' : 'Adicionar Item'}
          </Button>
        </Box>
      </Box>

      {/* Tabela de Estoques */}
      <Typography id="estoque-page-table-title" variant="h6" gutterBottom>
        Lista de Estoques
      </Typography>
      {loading ? (
        <CircularProgress id="estoque-page-table-loading" />
      ) : (
        <TableContainer id="estoque-page-table-container">
          <Table id="estoque-page-table">
            <TableHead id="estoque-page-table-head">
              <TableRow id="estoque-page-table-head-row">
                <TableCell id="estoque-page-table-head-descricao">Descrição</TableCell>
                <TableCell id="estoque-page-table-head-quantidade">Quantidade</TableCell>
                <TableCell id="estoque-page-table-head-medida">Medida</TableCell>
                <TableCell id="estoque-page-table-head-quantidade-minima">Quantidade Mínima</TableCell>
                <TableCell id="estoque-page-table-head-acoes">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody id="estoque-page-table-body">
              {estoques.map((estoque) => (
                <TableRow
                  id={`estoque-page-table-row-${estoque.id_estoque}`}
                  key={estoque.id_estoque}
                >
                  <TableCell id={`estoque-page-table-cell-descricao-${estoque.id_estoque}`}>
                    {getDescricaoIngrediente(estoque.ingrediente_Id_ingrediente)}
                  </TableCell>
                  <TableCell id={`estoque-page-table-cell-quantidade-${estoque.id_estoque}`}>
                    {estoque.quantidade}
                  </TableCell>
                  <TableCell id={`estoque-page-table-cell-medida-${estoque.id_estoque}`}>
                    {estoque.medida}
                  </TableCell>
                  <TableCell id={`estoque-page-table-cell-quantidade-minima-${estoque.id_estoque}`}>
                    {estoque.quantidade_minima}
                  </TableCell>
                  <TableCell id={`estoque-page-table-cell-acoes-${estoque.id_estoque}`}>
                    <IconButton
                      id={`estoque-page-edit-button-${estoque.id_estoque}`}
                      onClick={() => handleEdit(estoque.id_estoque)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      id={`estoque-page-delete-button-${estoque.id_estoque}`}
                      onClick={() => handleDelete(estoque.id_estoque)}
                    >
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
