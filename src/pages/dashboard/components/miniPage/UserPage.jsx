import React, { useState, useEffect } from 'react';
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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { getUsers, createUser, updateUser, deleteUser } from '../../../../apis/requests';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        setError('Falha ao buscar usuários.');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleSave = async (userData) => {
    setLoading(true);
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, userData);
      } else {
        await createUser(userData);
      }
      setSuccess('Usuário salvo com sucesso.');
      setUsers(await getUsers());
      setSelectedUser(null);
    } catch (error) {
      setError('Falha ao salvar o usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Você tem certeza que deseja excluir este usuário?')) {
      setLoading(true);
      try {
        await deleteUser(userId);
        setSuccess('Usuário excluído com sucesso.');
        setUsers(await getUsers());
      } catch (error) {
        setError('Falha ao excluir o usuário.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4">Gerenciamento de Usuários</Typography>
      </Box>

      {/* Feedback de erro e sucesso */}
      {error && <Snackbar open={true} autoHideDuration={6000}><Alert severity="error">{error}</Alert></Snackbar>}
      {success && <Snackbar open={true} autoHideDuration={6000}><Alert severity="success">{success}</Alert></Snackbar>}

      <Grid container spacing={3}>
        {/* Formulário de Adicionar/Editar Usuário */}
        <Grid item xs={12} md={4}>
          <UserForm selectedUser={selectedUser} onSave={handleSave} />
        </Grid>

        {/* Lista de Usuários */}
        <Grid item xs={12} md={8}>
          {loading ? <CircularProgress /> : (
            <UserList
              users={users}
              onEdit={(user) => setSelectedUser(user)}
              onDelete={handleDelete}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

const UserForm = ({ selectedUser, onSave }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [accessCreateUser, setAccessCreateUser] = useState(false);
  const [accessDashboard, setAccessDashboard] = useState(false);
  const [accessCreateOrder, setAccessCreateOrder] = useState(false);
  const [accessStock, setAccessStock] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setNome(selectedUser.nome || '');
      setEmail(selectedUser.email || '');
      setSenha('');
      setAccessCreateUser(selectedUser.acesso_criar_usuario || false);
      setAccessDashboard(selectedUser.acesso_dashboard || false);
      setAccessCreateOrder(selectedUser.acesso_criar_pedido || false);
      setAccessStock(selectedUser.acesso_estoque || false);
    } else {
      setNome('');
      setEmail('');
      setSenha('');
      setAccessCreateUser(false);
      setAccessDashboard(false);
      setAccessCreateOrder(false);
      setAccessStock(false);
    }
  }, [selectedUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userData = {
      nome,
      email,
      senha: senha || undefined,
      acesso_criar_usuario: accessCreateUser,
      acesso_dashboard: accessDashboard,
      acesso_criar_pedido: accessCreateOrder,
      acesso_estoque: accessStock,
    };
    await onSave(userData);
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6">{selectedUser ? 'Editar Usuário' : 'Adicionar Usuário'}</Typography>
      <TextField
        label="Nome"
        fullWidth
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        sx={{ mb: 2 }}
        required
      />
      <TextField
        label="Email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
        required
        type="email"
      />
      <TextField
        label="Senha"
        fullWidth
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        sx={{ mb: 2 }}
        type="senha"
      />
      <FormControlLabel
        control={<Checkbox checked={accessCreateUser} onChange={(e) => setAccessCreateUser(e.target.checked)} />}
        label="Acesso: Criar Usuário"
      />
      <FormControlLabel
        control={<Checkbox checked={accessDashboard} onChange={(e) => setAccessDashboard(e.target.checked)} />}
        label="Acesso: Dashboard"
      />
      <FormControlLabel
        control={<Checkbox checked={accessCreateOrder} onChange={(e) => setAccessCreateOrder(e.target.checked)} />}
        label="Acesso: Criar Pedido"
      />
      <FormControlLabel
        control={<Checkbox checked={accessStock} onChange={(e) => setAccessStock(e.target.checked)} />}
        label="Acesso: Estoque"
      />
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar'}
      </Button>
    </Box>
  );
};

const UserList = ({ users, onEdit, onDelete }) => {
  if (!users.length) return <Typography>Nenhum usuário encontrado.</Typography>;

  return (
    <List>
      {users.map((user) => (
        <ListItem key={user.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <ListItemText
            primary={user.nome}
            secondary={`Email: ${user.email}, Permissões: ${[
              user.acesso_criar_usuario ? 'Criar Usuário' : '',
              user.acesso_dashboard ? 'Dashboard' : '',
              user.acesso_criar_pedido ? 'Criar Pedido' : '',
              user.acesso_estoque ? 'Estoque' : '',
            ].filter(Boolean).join(', ')}`}
          />
          <Box>
            <IconButton onClick={() => onEdit(user)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => onDelete(user.id)}>
              <Delete />
            </IconButton>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default UserPage;
