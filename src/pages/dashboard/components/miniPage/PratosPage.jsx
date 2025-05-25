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
    const newvalue =  name === 'tempo' ?  parseInt(value) : value;
    setPratoAtual(prev => ({ ...prev, [name]: newvalue }));
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
      const selecionados = prato.Ingredientes.map(ing => ing.id_ingrediente); ;
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

    setPratoAtual((prev) => ({
      ...prev,
      preco: parseFloat(value)
    }));
  };


  return (
    <Container id="pratos-page-container">
      <Box id="pratos-page-header" my={4}>
        <Typography id="pratos-page-title" variant="h4">Gestão de Pratos</Typography>
      </Box>
      {error && <Snackbar id="pratos-page-error-snackbar" open autoHideDuration={6000}><Alert id="pratos-page-error-alert" severity="error">{error}</Alert></Snackbar>}
      {success && <Snackbar id="pratos-page-success-snackbar" open autoHideDuration={6000}><Alert id="pratos-page-success-alert" severity="success">{success}</Alert></Snackbar>}

      <Box id="pratos-page-form" component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Grid id="pratos-page-form-grid" container spacing={2}>
          <Grid id="pratos-page-form-nome" item xs={12} sm={4}>
            <TextField
              id="pratos-page-input-nome"
              label="Nome do Prato"
              name="nome"
              value={pratoAtual.nome}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid id="pratos-page-form-preco" item xs={12} sm={4}>
            <TextField
              id="pratos-page-input-preco"
              label="Preço"
              name="preco"
              type="number"
              value={pratoAtual.preco}
              onChange={handlePriceChange}
              fullWidth
              required
            />
          </Grid>
          <Grid id="pratos-page-form-tempo" item xs={12} sm={4}>
            <TextField
              id="pratos-page-input-tempo"
              label="Tempo de Preparo (min)"
              name="tempo"
              type="number"
              value={pratoAtual.tempo}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid id="pratos-page-form-descricao" item xs={12}>
            <TextField
              id="pratos-page-input-descricao"
              label="Descrição do Prato"
              name="descricao"
              multiline
              fullWidth
              value={pratoAtual.descricao}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid id="pratos-page-form-ingredientes" item xs={12}>
            <TextField
              id="pratos-page-input-ingredientes"
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
                <MenuItem id={`pratos-page-option-ingrediente-${ing.Id_ingrediente}`} key={ing.Id_ingrediente} value={ing.Id_ingrediente}>
                  {ing.descricao}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Box id="pratos-page-form-actions" mt={2}>
          <Button id="pratos-page-submit-button" type="submit" variant="contained" disabled={loading} onClick={handleSubmit}>
            {loading ? <CircularProgress id="pratos-page-loading" size={24} /> : 'Salvar Prato'}
          </Button>
        </Box>
      </Box>

      <TableContainer id="pratos-page-table-container">
        <Table id="pratos-page-table">
          <TableHead id="pratos-page-table-head">
            <TableRow id="pratos-page-table-head-row">
              <TableCell id="pratos-page-table-head-nome">Nome do Prato</TableCell>
              <TableCell id="pratos-page-table-head-preco">Preço</TableCell>
              <TableCell id="pratos-page-table-head-tempo">Tempo de Preparo</TableCell>
              <TableCell id="pratos-page-table-head-acoes">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody id="pratos-page-table-body">
            {pratos.map((prato) => (
              <TableRow id={`pratos-page-table-row-${prato.id_prato}`} key={prato.id_prato}>
                <TableCell id={`pratos-page-table-cell-nome-${prato.id_prato}`}>{prato.nome}</TableCell>
                <TableCell id={`pratos-page-table-cell-preco-${prato.id_prato}`}>R$ {parseFloat(prato.preco).toFixed(2)}</TableCell>
                <TableCell id={`pratos-page-table-cell-tempo-${prato.id_prato}`}>{prato.tempo} min</TableCell>
                <TableCell id={`pratos-page-table-cell-acoes-${prato.id_prato}`}>
                  <IconButton id={`pratos-page-edit-button-${prato.id_prato}`} onClick={() => handleEdit(prato.id_prato)}>
                    <Edit />
                  </IconButton>
                  <IconButton id={`pratos-page-delete-button-${prato.id_prato}`} onClick={() => handleDelete(prato.id_prato)}>
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