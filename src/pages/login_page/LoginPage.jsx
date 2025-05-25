// LoginPage.js

import { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { loginApi } from '../../apis/requests';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../apis/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { setUserId } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (email === '' || password === '') {
      setError('Por favor, preencha todos os campos.');
      setSuccess('');
      return;
    }

    try {
      setError('');
      setSuccess('');
   
      const data = await loginApi(email, password);
    
      setSuccess('Login realizado com sucesso!');
      setError('');
      setUserId(data.usuarios.id); 
      (data.token ) ? navigate("/Home") : setError("Senha ou email invalido!");
    
    } catch (error) {
      console.log(error)
      setError("Senha ou email invalido!");
      setSuccess('');
    }
  };

  return (
    <Container id="login-page-container" maxWidth="xs">
      <Box
        id="login-page-box"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography id="login-page-title" variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form id="login-page-form" onSubmit={handleLogin} style={{ width: '100%', marginTop: '1em' }}>
          {error && <Alert id="login-page-error-alert" severity="error">{error}</Alert>}
          {success && <Alert id="login-page-success-alert" severity="success">{success}</Alert>}
          <TextField
            id="login-page-email-input"
            label="E-mail"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="login-page-password-input"
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            id="login-page-submit-button"
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Entrar
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default LoginPage;
