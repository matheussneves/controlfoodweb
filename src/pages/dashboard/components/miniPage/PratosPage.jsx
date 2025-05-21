import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, TextField, Button,
  Grid, Snackbar, Alert, CircularProgress,
  TableContainer, Table, TableHead, TableRow,
  TableCell, TableBody, IconButton, MenuItem
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import {
  getPratos,
  getIngredientes,
  updatePrato,
  createPrato,
  deletePrato ,
  getEstoques// <-- Adicione esta importação
} from '../../../../apis/requests';

const pratoVazio = {
  nome: '',
  descricao: '',
  preco: 0,
  tempo: 0,
};

function PratosPage() {
  const [pratos, setPratos] = useState([]);
  const [pratoAtual, setPratoAtual] = useState(pratoVazio);
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    carregarPratos();
    carregarIngredientes();
    carregarEstoque();
  }, []);

  const carregarPratos = async () => {
    setLoading(true);
    try {
      const data = await getPratos();
      setPratos(data);
    } catch {
      setError('Erro ao carregar pratos');
    } finally {
      setLoading(false);
    }
  };

  const carregarIngredientes = async () => {
    try {
      const data = await getIngredientes();
      setIngredientes(data);
    } catch {
      setError('Erro ao carregar ingredientes');
    }
  };

  const carregarEstoque = async () => {
    try {
      const data = await getEstoques();
      setEstoque(data);
    } catch {
      setError('Erro ao carregar estoque');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Monta o array de ingredientes conforme o swagger
      const listaApi = ingredientesSelecionados.map(id => {
        const ing = estoque.find(i => i.ingrediente_Id_ingrediente === id);
        if (!ing || ing.quantidade <= 0) {
          throw new Error(`Ingrediente sem estoque`);
        }
        return {
          id_ingrediente: ing.ingrediente_Id_ingrediente,
          quantidade: ing.quantidade || 0,
          medida: ing.medida || ''
        };
      });
       //console.log('listaApi ', listaApi);
  
      
      const body = {
        ...pratoAtual,
        ingredientes: listaApi,
      };
 console.log('body ', JSON.stringify(body));
      if (pratoAtual.id_prato) {
        await updatePrato(pratoAtual.id_prato, body);
        setSuccess('Prato atualizado com sucesso');
      } else {
        
        await createPrato(body);
        setSuccess('Prato salvo com sucesso');
      }

      setPratoAtual(pratoVazio);
      setIngredientesSelecionados([]);
      carregarPratos();
    } catch (error) {
      setError('Erro ao salvar prato: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPratoAtual(prev => ({ ...prev, [name]: value }));
  };

  // Novo handler para ingredientes usando TextField multiple
  const handleIngredientesChange = (e) => {
    const selectedIds = Array.isArray(e.target.value)
      ? e.target.value.map(Number)
      : [Number(e.target.value)];
    setIngredientesSelecionados(selectedIds);
  };

  const handleEdit = (id) => {
    const prato = pratos.find(p => p.id_prato === id);
    if (prato) {
      setPratoAtual(prato);
      // ingredientesSelecionados agora é um array de ids
      const selecionados = prato.ingredientes?.map(ing => ing.id_ingrediente) || [];
      setIngredientesSelecionados(selecionados);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePrato(id);
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
            <TextField
              label="Descrição do Prato"
              name="descricao"
              multiline
              fullWidth
              value={pratoAtual.descricao}
              onChange={handleChange}
              
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Selecione os ingredientes"
              select
              name="ingredientes"
              fullWidth
              required
              SelectProps={{ multiple: true }}
              value={ingredientesSelecionados}
              onChange={handleIngredientesChange}
            >
              {ingredientes.map((ing) => (
                <MenuItem key={ing.Id_ingrediente} value={ing.Id_ingrediente}>
                  {ing.descricao}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Box mt={2}>
          <Button type="submit" variant="contained" disabled={loading} onClick={handleSubmit}>
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
