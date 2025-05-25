import React, { useState, useEffect } from 'react';
import { createCliente, getClientes, getClienteById, updateCliente, deleteCliente } from '../../../../apis/requests';
import { Container, Box, Grid, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert } from '@mui/material';

function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [clienteAtual, setClienteAtual] = useState({ nome: '', telefone: '', endereco: '' });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [clienteId, setClienteId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleDelete = async (id) => {
    try {
      await deleteCliente(id);
      setSuccess('Cliente excluído com sucesso!');
      carregarClientes();
    } catch (error) {
      setError('Erro ao excluir cliente.');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setClienteAtual((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container id="clientes-page-container">
      <Box id="clientes-page-header" my={4}>
        <Typography id="clientes-page-title" variant="h4" gutterBottom>Gestão de Clientes</Typography>

        <form id="clientes-page-form" onSubmit={handleSubmit}>
          <Grid id="clientes-page-form-grid" container spacing={2}>
            <Grid id="clientes-page-form-nome" item xs={18} md={6}>
              <TextField
                id="clientes-page-input-nome"
                label="Nome"
                name="nome"
                value={clienteAtual.nome}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid id="clientes-page-form-telefone" item xs={18} md={6}>
              <TextField
                id="clientes-page-input-telefone"
                label="Telefone"
                name="telefone"
                value={clienteAtual.telefone}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid id="clientes-page-form-endereco" item xs={39} md={13}>
              <TextField
                id="clientes-page-input-endereco"
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
            id="clientes-page-submit-button"
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            {modoEdicao ? 'Atualizar Cliente' : 'Adicionar Cliente'}
          </Button>
        </form>
      </Box>

      <Box id="clientes-page-list" my={4}>
        <Typography id="clientes-page-list-title" variant="h6">Lista de Clientes</Typography>
        <TableContainer id="clientes-page-table-container" component={Paper}>
          <Table id="clientes-page-table">
            <TableHead id="clientes-page-table-head">
              <TableRow id="clientes-page-table-head-row">
                <TableCell id="clientes-page-table-head-nome">Nome</TableCell>
                <TableCell id="clientes-page-table-head-endereco">Endereco</TableCell>
                <TableCell id="clientes-page-table-head-telefone">Telefone</TableCell>
                <TableCell id="clientes-page-table-head-acoes">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody id="clientes-page-table-body">
              {clientes.map((cliente) => (
                <TableRow id={`clientes-page-table-row-${cliente.id_cliente}`} key={cliente.id_cliente}>
                  <TableCell id={`clientes-page-table-cell-nome-${cliente.id_cliente}`}>{cliente.nome}</TableCell>
                  <TableCell id={`clientes-page-table-cell-endereco-${cliente.id_cliente}`}>{cliente.endereco}</TableCell>
                  <TableCell id={`clientes-page-table-cell-telefone-${cliente.id_cliente}`}>{cliente.telefone}</TableCell>
                  <TableCell id={`clientes-page-table-cell-acoes-${cliente.id_cliente}`}>
                    <Button
                      id={`clientes-page-edit-button-${cliente.id_cliente}`}
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(cliente.id_cliente)}
                    >
                      Editar
                    </Button>
                    <Button
                      id={`clientes-page-delete-button-${cliente.id_cliente}`}
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

      <Snackbar id="clientes-page-error-snackbar" open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert id="clientes-page-error-alert" severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar id="clientes-page-success-snackbar" open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
        <Alert id="clientes-page-success-alert" severity="success">{success}</Alert>
      </Snackbar>
    </Container>
  );
}

export default ClientesPage;
