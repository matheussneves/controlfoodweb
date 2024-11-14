import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Typography, CircularProgress, Snackbar, TextField, Button, List, ListItem, ListItemText, ListItemButton, ListItemIcon, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Alert } from '@mui/material';
import { getUsers, createUser, updateUser, deleteUser } from '../../../../apis/requests'; // Certifique-se de que essas funções estão definidas corretamente.

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
        setError('Failed to fetch users');
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
      setSuccess('User saved successfully');
      setUsers(await getUsers());
      setSelectedUser(null);
    } catch (error) {
      setError('Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      try {
        await deleteUser(userId);
        setSuccess('User deleted successfully');
        setUsers(await getUsers());
      } catch (error) {
        setError('Failed to delete user');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4">User Management</Typography>
      </Box>

      {/* Snackbar para feedback de erro ou sucesso */}
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
      setRole(selectedUser.role);
    } else {
      setName('');
      setEmail('');
      setRole('');
    }
  }, [selectedUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userData = { name, email, role };
    await onSave(userData);
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6">{selectedUser ? 'Edit User' : 'Add New User'}</Typography>
      <TextField
        label="Name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        label="Role"
        fullWidth
        value={role}
        onChange={(e) => setRole(e.target.value)}
        sx={{ mb: 2 }}
        required
      />
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </Box>
  );
};

const UserList = ({ users, onEdit, onDelete }) => {
  if (!users.length) return <Typography>No users found</Typography>;

  return (
    <List>
      {users.map((user) => (
        <ListItem key={user.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <ListItemText primary={user.name} secondary={user.email} />
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
