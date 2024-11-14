import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Typography, CircularProgress, Snackbar, TextField, Button, List, ListItem, ListItemText, ListItemButton, ListItemIcon, IconButton, Alert } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { getDeliverers, createDeliverer, updateDeliverer, deleteDeliverer } from '../../../../../apis/requests'; // Certifique-se de que essas funções estão definidas corretamente.

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
        setError('Failed to fetch deliverers');
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
      setSuccess('Deliverer saved successfully');
      setDeliverers(await getDeliverers());
      setSelectedDeliverer(null);
    } catch (error) {
      setError('Failed to save deliverer');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (delivererId) => {
    if (window.confirm('Are you sure you want to delete this deliverer?')) {
      setLoading(true);
      try {
        await deleteDeliverer(delivererId);
        setSuccess('Deliverer deleted successfully');
        setDeliverers(await getDeliverers());
      } catch (error) {
        setError('Failed to delete deliverer');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Deliverer Management
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDeliverer) {
      setName(selectedDeliverer.name);
      setEmail(selectedDeliverer.email);
      setVehicle(selectedDeliverer.vehicle);
    } else {
      setName('');
      setEmail('');
      setVehicle('');
    }
  }, [selectedDeliverer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const delivererData = { name, email, vehicle };
    await onSave(delivererData);
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6">{selectedDeliverer ? 'Edit Deliverer' : 'Add New Deliverer'}</Typography>
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
        label="Vehicle"
        fullWidth
        value={vehicle}
        onChange={(e) => setVehicle(e.target.value)}
        sx={{ mb: 2 }}
        required
      />
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </Box>
  );
};

const DelivererList = ({ deliverers, onEdit, onDelete }) => {
  if (!deliverers.length) return <Typography>No deliverers found</Typography>;

  return (
    <List>
      {deliverers.map((deliverer) => (
        <ListItem key={deliverer.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <ListItemText primary={deliverer.name} secondary={deliverer.email} />
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
