import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, TextField, Button,
  Grid, Snackbar, Alert, CircularProgress,
  TableContainer, Table, TableHead, TableRow,
  TableCell, TableBody, IconButton, MenuItem, Checkbox, ListItemText, Select
} from '@mui/material';
import { MultiSelect } from 'primereact/multiselect';
import { Edit, Delete } from '@mui/icons-material';
import {
  getPratos,
  getIngredientes,
  updatePrato,
  createPrato,
  deletePrato,
  getEstoques
} from '../../../../apis/requests';

// Constantes de prato vazio para iniciar a criação ou edição
const pratoVazio = {
  nome: '',
  descricao: '',
  preco: '',
  tempo: '',
};

function PratosPage() {
  const [pratos, setPratos] = useState([]); // Lista de pratos
  const [pratoAtual, setPratoAtual] = useState(pratoVazio); // Prato sendo editado ou criado
  const [ingredientes, setIngredientes] = useState([]); // Ingredientes disponíveis
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState([]); // Ingredientes selecionados
  const [estoque, setEstoque] = useState([]); // Estoque dos ingredientes
  const [loading, setLoading] = useState(false); // Estado de loading (esperando resposta da API)
  const [error, setError] = useState(''); // Mensagem de erro
  const [success, setSuccess] = useState(''); // Mensagem de sucesso

  // Carrega os dados iniciais
  useEffect(() => {
    carregarPratos();
    carregarIngredientes();
  }, []);

  // Função para carregar os pratos
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

  // Função para carregar os ingredientes
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

  // Função para carregar o estoque
  const carregarEstoque = async () => {
    try {
      const data = await getEstoques();
      setEstoque(data);
    } catch {
      setError('Erro ao carregar estoque');
    }
  };

  // Função de submit (salvar prato)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Verifica se todos os ingredientes selecionados possuem estoque suficiente
      const listaApi = ingredientesSelecionados.map(id => {
        const ing = estoque.find(i => i.ingrediente_Id_ingrediente === id);
        if (!ing || ing.quantidade <= 0) {
          throw new Error(`Ingrediente ${ing.descricao} sem estoque suficiente`);
        }
        return {
          id_ingrediente: ing.ingrediente_Id_ingrediente,
          quantidade: ing.quantidade || 0,
          medida: ing.medida || ''
        };
      });

      const body = {
        ...pratoAtual,  // Inclui todos os dados do prato
        ingredientes: listaApi,  // Passa os ingredientes com a quantidade e medida
      };

      // Cria ou atualiza o prato
      if (pratoAtual.id_prato) {
        await updatePrato(pratoAtual.id_prato, body);
        setSuccess('Prato atualizado com sucesso');
      } else {
        await createPrato(body);
        setSuccess('Prato salvo com sucesso');
      }

      // Resetando os estados para criar ou editar outro prato
      setPratoAtual(pratoVazio);
      setIngredientesSelecionados([]);
      carregarPratos(); // Atualiza a lista de pratos
    } catch (error) {
      setError('Erro ao salvar prato: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para tratar mudanças no input do prato
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPratoAtual(prev => ({ ...prev, [name]: value }));
  };

  // Função para atualizar os ingredientes selecionados
  const handleIngredientesChange = (e) => {
    const selectedIds = e.target.value;
    setIngredientesSelecionados(selectedIds);
  };

  // Função para editar um prato existente
  const handleEdit = (id) => {
    const prato = pratos.find(p => p.id_prato === id);
    if (prato) {
      setPratoAtual(prato);
      const selecionados = prato.ingredientes?.map(ing => ing.id_ingrediente) || [];
      setIngredientesSelecionados(selecionados);
    }
  };

  // Função para excluir um prato
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:21229/pratos/${id}`);
      setSuccess('Prato excluído com sucesso');
      carregarPratos(); // Atualiza a lista de pratos
    } catch {
      setError('Erro ao excluir prato');
    }
  };

  // Função para tratar a mudança no preço (convertendo para número)
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

      {/* Exibe mensagens de erro e sucesso */}
      {error && <Snackbar open autoHideDuration={6000}><Alert severity="error">{error}</Alert></Snackbar>}
      {success && <Snackbar open autoHideDuration={6000}><Alert severity="success">{success}</Alert></Snackbar>}

      {/* Formulário para criar ou editar um prato */}
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

          {/* Seleção de ingredientes */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Selecione os ingredientes
            </Typography>
            <Select
              multiple
              value={ingredientesSelecionados}
              onChange={handleIngredientesChange}
              fullWidth
              displayEmpty
              renderValue={(selected) => selected.length === 0 ? 'Selecione ingredientes' : `${selected.length} ingrediente(s) selecionado(s)`}
            >
              {ingredientes.map((ing) => (
                <MenuItem key={ing.Id_ingrediente} value={ing.Id_ingrediente}>
                  <Checkbox checked={ingredientesSelecionados.indexOf(ing.Id_ingrediente) > -1} />
                  <ListItemText primary={ing.descricao} />
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>

        <Box mt={2}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Salvar Prato'}
          </Button>
        </Box>
      </Box>

      {/* Tabela de pratos */}
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
