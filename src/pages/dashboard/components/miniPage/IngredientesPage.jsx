import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { createIngrediente, getIngredientes, getIngredienteById, updateIngrediente, deleteIngrediente } from '../../../../apis/requests'; // Importa as funções de API para ingredientes

function IngredientesPage() {
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredienteAtual, setIngredienteAtual] = useState({ descricao: '', contem_alergicos: '', informacoes_nutricionais: '' });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [ingredienteId, setIngredienteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Função para carregar os ingredientes
  useEffect(() => {
    carregarIngredientes();
  }, []);

  const carregarIngredientes = async () => {
    setLoading(true);
    try {
      const data = await getIngredientes();
      setIngredientes(data);
    } catch (error) {
      setError('Erro ao carregar ingredientes');
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com a submissão do formulário de novo ingrediente
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (modoEdicao) {
        await updateIngrediente(ingredienteId, ingredienteAtual);
      } else {
        await createIngrediente(ingredienteAtual);
      }
      setSuccess(modoEdicao ? 'Ingrediente atualizado com sucesso' : 'Ingrediente adicionado com sucesso');
      setIngredienteAtual({ descricao: '', contem_alergicos: '', informacoes_nutricionais: '' });
      setModoEdicao(false);
      setIngredienteId(null);
      carregarIngredientes();
    } catch (error) {
      setError('Erro ao salvar ingrediente');
    } finally {
      setLoading(false);
    }
  };

  // Função para editar um ingrediente
  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const ingrediente = await getIngredienteById(id);
      setIngredienteAtual(ingrediente);
      setModoEdicao(true);
      setIngredienteId(id);
    } catch (error) {
      setError('Erro ao carregar ingrediente' + id);
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir um ingrediente
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este ingrediente?')) {
      setLoading(true);
      try {
        await deleteIngrediente(id);
        setSuccess('Ingrediente excluído com sucesso');
        carregarIngredientes();
      } catch (error) {
        setError('Erro ao excluir ingrediente');
      } finally {
        setLoading(false);
      }
    }
  };

  // Função para lidar com mudanças no formulário
  const handleChange = (event) => {
    const { name, value } = event.target;
    setIngredienteAtual((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Gestão de Ingredientes
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

      {/* Formulário de Adicionar/Editar Ingrediente */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Descricao"
              name="descricao"
              value={ingredienteAtual.descricao}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Contem alergicos"
              name="contem_alergicos"
              type="number"
              value={ingredienteAtual.contem_alergicos}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Informacoes nutricionais"
              name="informacoes_nutricionais"
              value={ingredienteAtual.informacoes_nutricionais}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (modoEdicao ? 'Atualizar Ingrediente' : 'Adicionar Ingrediente')}
          </Button>
        </Box>
      </Box>

      {/* Tabela de Ingredientes */}
      <Typography variant="h6" gutterBottom>
        Lista de Ingredientes
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Descricao</TableCell>
                <TableCell>Contem alergicos</TableCell>
                <TableCell>Informações nutricionais</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ingredientes.map((ingrediente) => (
                <TableRow key={ingrediente.Id_ingrediente}>
                  <TableCell>{ingrediente.descricao}</TableCell>
                  <TableCell>{ingrediente.contem_alergicos}</TableCell>
                  <TableCell>{ingrediente.informacoes_nutricionais}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(ingrediente.Id_ingrediente)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(ingrediente.Id_ingrediente)}>
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

export default IngredientesPage;
