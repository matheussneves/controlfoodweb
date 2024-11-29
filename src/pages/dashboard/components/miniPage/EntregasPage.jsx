import React, { useState, useEffect } from 'react';
import { getEntregas } from '../../../../apis/requests'; 
import { Container, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Snackbar, Alert } from '@mui/material';

function EntregasPage() {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarEntregas();
  }, []);

  const carregarEntregas = async () => {
    setLoading(true);
    try {
      const data = await getEntregas();
      setEntregas(data);
    } catch (error) {
      setError('Erro ao carregar entregas.');
    } finally {
      setLoading(false);
    }
  };

  const formatarDataHora = (data) => {
    if (!data) return '';
    const date = new Date(data);
    return date.toLocaleString('pt-BR');
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>Lista de Entregas</Typography>

        {/* Exibindo mensagens de erro */}
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>

        {/* Se estiver carregando, exibe o indicador de carregamento */}
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Endereço</TableCell>
                  <TableCell>Data de Retirada</TableCell>
                  <TableCell>Data de Entrega</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entregas.map((entrega) => (
                  <TableRow key={entrega.id_entrega}>
                    <TableCell>{entrega.endereco}</TableCell>
                    <TableCell>{formatarDataHora(entrega.data_retirada)}</TableCell>
                    <TableCell>{formatarDataHora(entrega.data_entrega)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
}

export default EntregasPage;
