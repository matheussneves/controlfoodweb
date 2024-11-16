import React, { useState, useEffect } from 'react';
import { createCliente, getClientes, getClienteById, updateCliente, deleteCliente } from '../../../../apis/requests'; // Importa as funções de API para clientes
import { Container, Box, Grid, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert } from '@mui/material';

function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [clienteAtual, setClienteAtual] = useState({ nome: '', telefone: '' , endereco: '' });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [clienteId, setClienteId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Função para carregar os clientes
  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      setError('Erro ao carregar clientes.');
    }
  };

  // Função para lidar com a submissão do formulário de novo cliente
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (modoEdicao) {
        await updateCliente(clienteId, clienteAtual);
        setSuccess('Cliente atualizado com sucesso!');
      } else {
        await createCliente(clienteAtual);
        setSuccess('Cliente criado com sucesso!');
      }
      setClienteAtual({ nome: '', endereco: '', telefone: '' });
      setModoEdicao(false);
      setClienteId(null);
      carregarClientes();
    } catch (error) {
      setError('Erro ao salvar cliente:' + JSON.stringify(clienteAtual));
    }
  };

  // Função para editar um cliente
  const handleEdit = async (id) => {
    try {
      const cliente = await getClienteById(id);
      setClienteAtual(cliente);
      setModoEdicao(true);
      setClienteId(id);
    } catch (error) {
      setError('Erro ao carregar cliente.');
    }
  };

  // Função para excluir um cliente
  const handleDelete = async (id) => {
    try {
      await deleteCliente(id);
      setSuccess('Cliente excluído com sucesso!');
      carregarClientes();
    } catch (error) {
      setError('Erro ao excluir cliente.');
    }
  };

  // Função para lidar com mudanças no formulário
  const handleChange = (event) => {
    const { name, value } = event.target;
    setClienteAtual((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>Gestão de Clientes</Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={18} md={6}>
              <TextField
                label="Nome"
                name="nome"
                value={clienteAtual.nome}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
           
            <Grid item xs={18} md={6}>
              <TextField
                label="Telefone"
                name="telefone"
                value={clienteAtual.telefone}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={39} md={13}>
              <TextField
                label="Endereco"
                name="endereco"
                value={clienteAtual.endereco}
                onChange={handleChange}
                fullWidth
                required
                type="endereco"
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            {modoEdicao ? 'Atualizar Cliente' : 'Adicionar Cliente'}
          </Button>
        </form>

        <Box my={4}>
          <Typography variant="h6">Lista de Clientes</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Endereco</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id_cliente}>
                    <TableCell>{cliente.nome}</TableCell>
                    <TableCell>{cliente.endereco}</TableCell>
                    <TableCell>{cliente.telefone}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(cliente.id_cliente)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        sx={{ ml: 2 }}
                        onClick={() => handleDelete(cliente.id_cliente)}
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

export default ClientesPage;
