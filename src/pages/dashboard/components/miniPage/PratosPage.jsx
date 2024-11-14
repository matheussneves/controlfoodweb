import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { createPrato, getPratos, getPratoById, updatePrato, deletePrato } from '../../../../../apis/requests'; // Importa as funções de API para pratos

function PratosPage() {
  const [pratos, setPratos] = useState([]);
  const [pratoAtual, setPratoAtual] = useState({ nome: '', descricao: '', preco: '' });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [pratoId, setPratoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Função para carregar os pratos
  useEffect(() => {
    carregarPratos();
  }, []);

  const carregarPratos = async () => {
    setLoading(true);
    try {
      const data = await getPratos();
      setPratos(data);
    } catch (error) {
      setError('Erro ao carregar pratos');
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com a submissão do formulário de novo prato
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (modoEdicao) {
        await updatePrato(pratoId, pratoAtual);
      } else {
        await createPrato(pratoAtual);
      }
      setSuccess(modoEdicao ? 'Prato atualizado com sucesso' : 'Prato adicionado com sucesso');
      setPratoAtual({ nome: '', descricao: '', preco: '' });
      setModoEdicao(false);
      setPratoId(null);
      carregarPratos();
    } catch (error) {
      setError('Erro ao salvar prato');
    } finally {
      setLoading(false);
    }
  };

  // Função para editar um prato
  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const prato = await getPratoById(id);
      setPratoAtual(prato);
      setModoEdicao(true);
      setPratoId(id);
    } catch (error) {
      setError('Erro ao carregar prato');
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir um prato
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este prato?')) {
      setLoading(true);
      try {
        await deletePrato(id);
        setSuccess('Prato excluído com sucesso');
        carregarPratos();
      } catch (error) {
        setError('Erro ao excluir prato');
      } finally {
        setLoading(false);
      }
    }
  };

  // Função para lidar com mudanças no formulário
  const handleChange = (event) => {
    const { name, value } = event.target;
    setPratoAtual((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Gestão de Pratos
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

      {/* Formulário de Adicionar/Editar Prato */}
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
              label="Descrição"
              name="descricao"
              value={pratoAtual.descricao}
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
              value={pratoAtual.preco}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (modoEdicao ? 'Atualizar Prato' : 'Adicionar Prato')}
          </Button>
        </Box>
      </Box>

      {/* Tabela de Pratos */}
      <Typography variant="h6" gutterBottom>
        Lista de Pratos
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pratos.map((prato) => (
                <TableRow key={prato.id_prato}>
                  <TableCell>{prato.nome}</TableCell>
                  <TableCell>{prato.descricao}</TableCell>
                  <TableCell>{prato.preco}</TableCell>
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
      )}
    </Container>
  );
}

export default PratosPage;
