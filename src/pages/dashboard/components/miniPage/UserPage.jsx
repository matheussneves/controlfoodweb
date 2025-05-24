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
      setError('');
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
  setError('');
  setSuccess('');

  try {
    if (selectedUser) {
      const response = await updateUser(selectedUser.id_usuario, userData);
      setSuccess('Usuário atualizado com sucesso');
    } else {
      const response = await createUser(userData);

      // Agora aceita só a mensagem 'Usuário criado' como sucesso
      if (response?.message !== 'Usuário criado') {
        throw new Error('Erro ao criar usuário');
      }

      setSuccess('Usuário criado com sucesso');
    }

    // Aqui outras ações, tipo atualizar lista, fechar modal, etc.
  } catch (error) {
    setError(error.message || 'Erro desconhecido');
  } finally {
    setLoading(false);
  }
};



  const handleDelete = async (userId) => {
    if (window.confirm('Você tem certeza que deseja excluir este usuário?')) {
      setLoading(true);
      setError('');
      setSuccess('');
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

  const handleCloseError = () => setError('');
  const handleCloseSuccess = () => setSuccess('');

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4">Gerenciamento de Usuários</Typography>
      </Box>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert severity="error" onClose={handleCloseError} sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert severity="success" onClose={handleCloseSuccess} sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <UserForm selectedUser={selectedUser} onSave={handleSave} loading={loading} />
        </Grid>

        <Grid item xs={12} md={8}>
          {loading && !users.length ? (
            <CircularProgress />
          ) : (
            <UserList users={users} onEdit={setSelectedUser} onDelete={handleDelete} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

const UserForm = ({ selectedUser, onSave, loading }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [accessCreateUser, setAccessCreateUser] = useState(false);
  const [accessDashboard, setAccessDashboard] = useState(false);
  const [accessCreateOrder, setAccessCreateOrder] = useState(false);
  const [accessStock, setAccessStock] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setNome(selectedUser.nome || '');
      setEmail(selectedUser.email || '');
      setSenha('');
      setAccessCreateUser(Boolean(selectedUser.acesso_criar_usuario));
      setAccessDashboard(Boolean(selectedUser.acesso_dashboard));
      setAccessCreateOrder(Boolean(selectedUser.acesso_criar_pedido));
      setAccessStock(Boolean(selectedUser.acesso_estoque));
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
    const userData = {
      nome,
      email,
      ...(senha ? { senha } : {}),
      acesso_criar_usuario: accessCreateUser,
      acesso_dashboard: accessDashboard,
      acesso_criar_pedido: accessCreateOrder,
      acesso_estoque: accessStock,
    };
    await onSave(userData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2 }}
    >
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
        type="password"
        helperText={selectedUser ? 'Preencha apenas se quiser alterar a senha' : ''}
        required={!selectedUser} // senha obrigatória só se for criar novo
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
        <ListItem key={user.id_usuario} sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
            <IconButton onClick={() => onDelete(user.id_usuario)}>
              <Delete />
            </IconButton>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default UserPage;
