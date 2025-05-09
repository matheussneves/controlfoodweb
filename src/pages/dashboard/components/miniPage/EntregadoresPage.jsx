// src/pages/EntregadoresPage.jsx

import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import {
  Container,
  Box,
  Grid,
  Typography,
  CircularProgress,
  Snackbar,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  MenuItem,
  Select,
  Checkbox,
  ListItemText as MuiListItemText
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import {
  getDeliverers,
  createDeliverer,
  updateDeliverer,
  deleteDeliverer
} from '../../../../apis/requests';

const EntregadoresPage = () => {
  const [deliverers, setDeliverers] = useState([]);
  const [selectedDeliverer, setSelectedDeliverer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadDeliverers = async () => {
      setLoading(true);
      try {
        const data = await getDeliverers();
        setDeliverers(data);
      } catch (error) {
        setError('Falha ao buscar entregadores.');
      } finally {
        setLoading(false);
      }
    };
    loadDeliverers();
  }, []);

  const handleSave = async (delivererData) => {
    setLoading(true);
    try {
      if (selectedDeliverer) {
        await updateDeliverer(selectedDeliverer.id, delivererData);
      } else {
        await createDeliverer(delivererData);
      }
      setSuccess('Entregador salvo com sucesso.');
      setDeliverers(await getDeliverers());
      setSelectedDeliverer(null);
    } catch (error) {
      setError('Falha ao salvar o entregador.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (delivererId) => {
    if (window.confirm('Você tem certeza que deseja excluir este entregador?')) {
      setLoading(true);
      try {
        await deleteDeliverer(delivererId);
        setSuccess('Entregador excluído com sucesso.');
        setDeliverers(await getDeliverers());
      } catch (error) {
        setError('Falha ao excluir o entregador.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Gestão de Entregadores
        </Typography>
      </Box>

      {/* Notificações */}
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

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <DelivererForm selectedDeliverer={selectedDeliverer} onSave={handleSave} />
        </Grid>
        <Grid item xs={12} md={8}>
          {loading ? (
            <CircularProgress />
          ) : (
            <DelivererList
              deliverers={deliverers}
              onEdit={(deliverer) => setSelectedDeliverer(deliverer)}
              onDelete={handleDelete}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

const DelivererForm = ({ selectedDeliverer, onSave }) => {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [placa, setPlaca] = useState('');
  const [selectedTelefone, setSelectedTelefone] = useState([]);  // Estado para telefones múltiplos
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDeliverer) {
      setNome(selectedDeliverer.nome || '');
      setSenha(selectedDeliverer.senha || '');
      setTelefone(selectedDeliverer.telefone || '');
      setVeiculo(selectedDeliverer.veiculo || '');
      setPlaca(selectedDeliverer.placa || '');
      // Ajuste para múltiplos telefones, se houver
      if (selectedDeliverer.telefone) {
        setSelectedTelefone([selectedDeliverer.telefone]);
      }
    } else {
      setNome('');
      setSenha('');
      setTelefone('');
      setVeiculo('');
      setPlaca('');
      setSelectedTelefone([]);
    }
  }, [selectedDeliverer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const delivererData = { nome, senha, telefone: selectedTelefone.join(','), veiculo, placa };  // Junta os telefones em uma string separada por vírgulas
    await onSave(delivererData);
    setLoading(false);
  };

  const handleTelefoneChange = (event) => {
    const { value } = event.target;
    setSelectedTelefone((prev) => 
      prev.includes(value) ? prev.filter((telefone) => telefone !== value) : [...prev, value]
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6">
        {selectedDeliverer ? 'Editar Entregador' : 'Adicionar Novo Entregador'}
      </Typography>
      <TextField
        label="Nome"
        fullWidth
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        sx={{ mb: 2 }}
        required
      />
      <TextField
        label="Senha"
        fullWidth
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        sx={{ mb: 2 }}
        required
        type="password"
      />
      <InputMask
        mask="(99) 99999-9999"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
      >
        {(inputProps) => (
          <TextField
            {...inputProps}
            label="Telefone"
            fullWidth
            sx={{ mb: 2 }}
            required
          />
        )}
      </InputMask>

      {/* Campo para selecionar múltiplos telefones */}
      <TextField
        select
        label="Telefones"
        value={selectedTelefone}
        onChange={handleTelefoneChange}
        fullWidth
        SelectProps={{
          multiple: true,
          renderValue: (selected) => selected.join(', '),
        }}
        sx={{ mb: 2 }}
      >
        {['(11) 99999-9999', '(11) 98888-8888', '(11) 97777-7777'].map((telefone) => (
          <MenuItem key={telefone} value={telefone}>
            <Checkbox checked={selectedTelefone.indexOf(telefone) > -1} />
            <MuiListItemText primary={telefone} />
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Veículo"
        fullWidth
        value={veiculo}
        onChange={(e) => setVeiculo(e.target.value.toUpperCase())}
        sx={{ mb: 2, textTransform: 'uppercase' }}
        required
      />
      <TextField
        label="Placa"
        fullWidth
        value={placa}
        onChange={(e) => setPlaca(e.target.value.toUpperCase())}
        inputProps={{ maxLength: 7 }}
        sx={{ mb: 2, textTransform: 'uppercase' }}
        required
      />
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar'}
      </Button>
    </Box>
  );
};

const DelivererList = ({ deliverers, onEdit, onDelete }) => {
  if (!deliverers.length) return <Typography>Nenhum entregador encontrado.</Typography>;

  return (
    <List>
      {deliverers.map((deliverer) => (
        <ListItem key={deliverer.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <ListItemText
            primary={`${deliverer.nome} (${deliverer.veiculo} - ${deliverer.placa})`}
            secondary={`${deliverer.telefone}`}
          />
          <Box>
            <IconButton onClick={() => onEdit(deliverer)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => onDelete(deliverer.id)}>
              <Delete />
            </IconButton>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default EntregadoresPage;
