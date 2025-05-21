const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve arquivos estáticos da pasta "dist"
app.use(express.static(path.join(__dirname, 'dist')));

// Rota para fallback (caso de SPAs)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
