import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { createIngrediente, getIngredientes, getIngredienteById, updateIngrediente, deleteIngrediente } from '../../../../apis/requests';

const ingredienteVazio = {
  descricao: '',
  contem_alergicos: 0,
  informacoes_nutricionais: ''
};

function IngredientesPage() {
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredienteAtual, setIngredienteAtual] = useState(ingredienteVazio);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [ingredienteId, setIngredienteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    carregarIngredientes();
  }, []);

  const carregarIngredientes = async () => {
    setLoading(true);
    try {
      const data = await getIngredientes();
      setIngredientes(data);
    } catch (err) {
      console.error(err.response || err);
      setError('Erro ao carregar ingredientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...ingredienteAtual,
        contem_alergicos: Number(ingredienteAtual.contem_alergicos)
      };
      let msg;
      if (modoEdicao) {
        await updateIngrediente(ingredienteId, payload);
        msg = 'Ingrediente atualizado com sucesso';
      } else {
        msg = await createIngrediente(payload);
      }
      setSuccess(msg);
      setError('');
      setIngredienteAtual(ingredienteVazio);
      setModoEdicao(false);
      setIngredienteId(null);
      await carregarIngredientes();
    } catch (err) {
      console.error(err.response || err);
      setError('Erro ao salvar ingrediente');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const ingrediente = await getIngredienteById(id);
      setIngredienteAtual({
        descricao: ingrediente.descricao || '',
        contem_alergicos: ingrediente.contem_alergicos ?? 0,
        informacoes_nutricionais: ingrediente.informacoes_nutricionais || ''
      });
      setModoEdicao(true);
      setIngredienteId(id);
    } catch (err) {
      console.error(err.response || err);
      setError(`Erro ao carregar ingrediente ${id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este ingrediente?')) return;
    setLoading(true);
    try {
      await deleteIngrediente(id);
      setSuccess('Ingrediente excluído com sucesso');
      setError('');
      await carregarIngredientes();
    } catch (err) {
      console.error(err.response || err);
      setError('Erro ao excluir ingrediente');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setIngredienteAtual(prev => ({
      ...prev,
      [name]: name === 'contem_alergicos' ? Number(value) : value
    }));
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Gestão de Ingredientes
        </Typography>
      </Box>

      {(error || success) && (
        <Snackbar open autoHideDuration={6000} onClose={() => { setError(''); setSuccess(''); }}>
          <Alert severity={error ? 'error' : 'success'}>
            {error || success}
          </Alert>
        </Snackbar>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Descrição"
              name="descricao"
              value={ingredienteAtual.descricao}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Contém alérgicos"
              name="contem_alergicos"
              type="number"
              value={ingredienteAtual.contem_alergicos}
              onChange={handleChange}
              fullWidth
              inputProps={{ min: 0, max: 1 }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Informações nutricionais"
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
                <TableCell>Descrição</TableCell>
                <TableCell>Contém alérgicos</TableCell>
                <TableCell>Informações nutricionais</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ingredientes.map(ingrediente => (
                <TableRow key={ingrediente.Id_ingrediente}>
                  <TableCell>{ingrediente.descricao}</TableCell>
                  <TableCell>{ingrediente.contem_alergicos}</TableCell>
                  <TableCell>{ingrediente.informacoes_nutricionais}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(ingrediente.Id_ingrediente)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(ingrediente.Id_ingrediente)}><Delete /></IconButton>
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
