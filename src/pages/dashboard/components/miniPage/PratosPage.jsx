import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, TextField, Button,
  Grid, Snackbar, Alert, CircularProgress,
  TableContainer, Table, TableHead, TableRow,
  TableCell, TableBody, IconButton
} from '@mui/material';
import { MultiSelect } from 'primereact/multiselect';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const pratoVazio = {
  nome: '',
  descricao: '',
  preco: '',
  tempo: '',
};

function PratosPage() {
  const [pratos, setPratos] = useState([]);
  const [pratoAtual, setPratoAtual] = useState(pratoVazio);
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    carregarPratos();
    carregarIngredientes();
  }, []);

  const carregarPratos = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('https://controlfoodapi-d8a49e8667a8.herokuapp.com/pratos');
      setPratos(data);
    } catch {
      setError('Erro ao carregar pratos');
    } finally {
      setLoading(false);
    }
  };

  const carregarIngredientes = async () => {
    try {
      const response = await axios.get('https://controlfoodapi-d8a49e8667a8.herokuapp.com/ingredientes');
      const ops = response.data.map(item => ({
        label: item.descricao,
        value: item,
      }));
      setIngredientes(ops);
    } catch {
      setError('Erro ao carregar ingredientes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const listaApi = ingredientesSelecionados.map(i => i.value);
      const body = {
        ...pratoAtual,
        ingredientes: listaApi,
      };

      if (pratoAtual.id) {
        await axios.put(`https://controlfoodapi-d8a49e8667a8.herokuapp.com/pratos/${pratoAtual.id_prato}`, body);
        setSuccess('Prato atualizado com sucesso');
      } else {
        await axios.post('https://controlfoodapi-d8a49e8667a8.herokuapp.com/pratos', body);
        setSuccess('Prato salvo com sucesso');
      }

      setPratoAtual(pratoVazio);
      setIngredientesSelecionados([]);
      carregarPratos();
    } catch {
      setError('Erro ao salvar prato');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPratoAtual(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientesChange = (e) => {
    setIngredientesSelecionados(e.value);
  };

  const handleEdit = (id) => {
    const prato = pratos.find(p => p.id_prato === id);
    if (prato) {
      setPratoAtual(prato);
      const selecionados = prato.ingredientes?.map(ing => ({
        label: ing.descricao,
        value: ing,
      })) || [];
      setIngredientesSelecionados(selecionados);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:21229/pratos/${id}`);
      setSuccess('Prato excluído com sucesso');
  
      carregarPratos();
    } catch {
      setError('Erro ao excluir prato');
    }
  };

  // Função para formatar o preço corretamente
  const handlePriceChange = (e) => {
    const { value } = e.target;
    const numericValue = value.replace('R$', '').replace(/\D/g, '');
    setPratoAtual((prev) => ({
      ...prev,
      preco: numericValue ? (parseFloat(numericValue) / 100).toFixed(2) : '',
    }));
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4">Gestão de Pratos</Typography>
      </Box>
      {error && <Snackbar open autoHideDuration={6000}><Alert severity="error">{error}</Alert></Snackbar>}
      {success && <Snackbar open autoHideDuration={6000}><Alert severity="success">{success}</Alert></Snackbar>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Nome do Prato"
              name="nome"
              value={pratoAtual.nome}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Preço"
              name="preco"
              value={pratoAtual.preco}
              onChange={handlePriceChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Tempo de Preparo (min)"
              name="tempo"
              type="number"
              value={pratoAtual.tempo}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <MultiSelect
              value={ingredientesSelecionados}
              options={ingredientes}
              onChange={handleIngredientesChange}
              display="chip"
              optionLabel="label"
              placeholder="Selecione os ingredientes"
              style={{ width: '100%' }}
            />
            <TextField
                          label="Selecione os ingredientes"
                          select
                          name="ingredientess"
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
        </Grid>

        <Box mt={2}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Salvar Prato'}
          </Button>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome do Prato</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Tempo de Preparo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pratos.map((prato) => (
              <TableRow key={prato.id_prato}>
                <TableCell>{prato.nome}</TableCell>
                <TableCell>R$ {parseFloat(prato.preco).toFixed(2)}</TableCell>
                <TableCell>{prato.tempo} min</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(prato.id_prato)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(prato.id_prato)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default PratosPage;
