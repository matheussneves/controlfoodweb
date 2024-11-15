import React, { useState, useEffect } from 'react';
// import { 
//   createEntrega, 
//   getEntregas, 
//   getEntregaById, 
//   updateEntrega, 
//   deleteEntrega 
// } from '../../../../apis/requests'; // Importa as funções de API para entregas
import { Container, Box, Grid, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert } from '@mui/material';

function EntregasPage() {
  const [entregas, setEntregas] = useState([]);
  const [entregaAtual, setEntregaAtual] = useState({ destinatario: '', endereco: '', data: '' });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [entregaId, setEntregaId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Função para carregar as entregas
  useEffect(() => {
    carregarEntregas();
  }, []);

  const carregarEntregas = async () => {
    try {
      const data = await getEntregas();
      setEntregas(data);
    } catch (error) {
      setError('Erro ao carregar entregas.');
    }
  };

  // Função para lidar com a submissão do formulário de nova entrega
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (modoEdicao) {
        await updateEntrega(entregaId, entregaAtual);
        setSuccess('Entrega atualizada com sucesso!');
      } else {
        await createEntrega(entregaAtual);
        setSuccess('Entrega criada com sucesso!');
      }
      setEntregaAtual({ destinatario: '', endereco: '', data: '' });
      setModoEdicao(false);
      setEntregaId(null);
      carregarEntregas();
    } catch (error) {
      setError('Erro ao salvar entrega.');
    }
  };

  // Função para editar uma entrega
  const handleEdit = async (id) => {
    try {
      const entrega = await getEntregaById(id);
      setEntregaAtual(entrega);
      setModoEdicao(true);
      setEntregaId(id);
    } catch (error) {
      setError('Erro ao carregar entrega.');
    }
  };

  // Função para excluir uma entrega
  const handleDelete = async (id) => {
    try {
      await deleteEntrega(id);
      setSuccess('Entrega excluída com sucesso!');
      carregarEntregas();
    } catch (error) {
      setError('Erro ao excluir entrega.');
    }
  };

  // Função para lidar com mudanças no formulário
  const handleChange = (event) => {
    const { name, value } = event.target;
    setEntregaAtual((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>Gestão de Entregas</Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Destinatário"
                name="destinatario"
                value={entregaAtual.destinatario}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Endereço"
                name="endereco"
                value={entregaAtual.endereco}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Data"
                name="data"
                type="date"
                value={entregaAtual.data}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            {modoEdicao ? 'Atualizar Entrega' : 'Adicionar Entrega'}
          </Button>
        </form>

        <Box my={4}>
          <Typography variant="h6">Lista de Entregas</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Destinatário</TableCell>
                  <TableCell>Endereço</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entregas.map((entrega) => (
                  <TableRow key={entrega.id_entrega}>
                    <TableCell>{entrega.destinatario}</TableCell>
                    <TableCell>{entrega.endereco}</TableCell>
                    <TableCell>{entrega.data}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(entrega.id_entrega)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        sx={{ ml: 2 }}
                        onClick={() => handleDelete(entrega.id_entrega)}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Exibindo mensagens de erro e sucesso */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </Container>
  );
}

export default EntregasPage;
