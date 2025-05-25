import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, TextField, Button, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Snackbar, Alert, CircularProgress
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import {
  createIngrediente, getIngredientes, getIngredienteById,
  updateIngrediente, deleteIngrediente
} from '../../../../apis/requests';

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
        await createIngrediente(payload);
        msg = 'Ingrediente criado com sucesso';
      }
      setSuccess(msg);
setError('');
      setIngredienteAtual(ingredienteVazio);
      setModoEdicao(false);
      setIngredienteId(null);
      await carregarIngredientes();
    } catch (err) {
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
      setError(`Erro ao carregar ingrediente ${id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este ingrediente?')) return;
    setLoading(true);
    try {
      awaitsetError('');
deleteIngrediente(id);
setError('');
      setSuccess('Ingrediente excluído com sucesso');
setError('');
      await carregarIngredientes();
    } catch (err) {
      setError('Erro ao excluir ingrediente');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setIngredienteAtual(prev => ({
      ...prev,
      [name]: name === 'contem_alergicos' ? Number(value || 0) : value
    }));
  };

  return (
    <Container id="ingredientes-page-container">
      <Box id="ingredientes-page-header" my={4}>
        <Typography id="ingredientes-page-title" variant="h4" gutterBottom>
          Gestão de Ingredientes
        </Typography>
      </Box>

      {(error || success) && (
        <Snackbar id="ingredientes-page-snackbar" open autoHideDuration={6000} onClose={() => { setError(''); setSuccess(''); }}>
          <Alert id="ingredientes-page-alert" severity={error ? 'error' : 'success'}>
            {error || success}
          </Alert>
        </Snackbar>
      )}

      <Box id="ingredientes-page-form" component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Grid id="ingredientes-page-form-grid" container spacing={2}>
          <Grid id="ingredientes-page-form-descricao" item xs={12} sm={4}>
            <TextField
              id="ingredientes-page-input-descricao"
              label="Descrição"
              name="descricao"
              value={ingredienteAtual.descricao}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid id="ingredientes-page-form-alergicos" item xs={12} sm={4}>
            <TextField
              id="ingredientes-page-input-alergicos"
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
          <Grid id="ingredientes-page-form-nutricionais" item xs={12} sm={4}>
            <TextField
              id="ingredientes-page-input-nutricionais"
              label="Informações nutricionais"
              name="informacoes_nutricionais"
              value={ingredienteAtual.informacoes_nutricionais}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Box id="ingredientes-page-form-submit-box" mt={2}>
          <Button
            id="ingredientes-page-submit-button"
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress id="ingredientes-page-loading" size={24} /> : (modoEdicao ? 'Atualizar Ingrediente' : 'Adicionar Ingrediente')}
          </Button>
        </Box>
      </Box>

      <Typography id="ingredientes-page-table-title" variant="h6" gutterBottom>
        Lista de Ingredientes
      </Typography>
      {loading ? (
        <CircularProgress id="ingredientes-page-table-loading" />
      ) : (
        <TableContainer id="ingredientes-page-table-container">
          <Table id="ingredientes-page-table">
            <TableHead id="ingredientes-page-table-head">
              <TableRow id="ingredientes-page-table-head-row">
                <TableCell id="ingredientes-page-table-head-descricao">Descrição</TableCell>
                <TableCell id="ingredientes-page-table-head-alergicos">Contém alérgicos</TableCell>
                <TableCell id="ingredientes-page-table-head-nutricionais">Informações nutricionais</TableCell>
                <TableCell id="ingredientes-page-table-head-acoes">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody id="ingredientes-page-table-body">
              {ingredientes.map(ingrediente => (
                <TableRow id={`ingredientes-page-table-row-${ingrediente.Id_ingrediente}`} key={ingrediente.Id_ingrediente}>
                  <TableCell id={`ingredientes-page-table-cell-descricao-${ingrediente.Id_ingrediente}`}>
                    {ingrediente.descricao}
                  </TableCell>
                  <TableCell id={`ingredientes-page-table-cell-alergicos-${ingrediente.Id_ingrediente}`}>
                    {ingrediente.contem_alergicos}
                  </TableCell>
                  <TableCell id={`ingredientes-page-table-cell-nutricionais-${ingrediente.Id_ingrediente}`}>
                    {ingrediente.informacoes_nutricionais}
                  </TableCell>
                  <TableCell id={`ingredientes-page-table-cell-acoes-${ingrediente.Id_ingrediente}`}>
                    <IconButton
                      id={`ingredientes-page-edit-button-${ingrediente.Id_ingrediente}`}
                      onClick={() => handleEdit(ingrediente.Id_ingrediente)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      id={`ingredientes-page-delete-button-${ingrediente.Id_ingrediente}`}
                      onClick={() => handleDelete(ingrediente.Id_ingrediente)}
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

export default IngredientesPage;
