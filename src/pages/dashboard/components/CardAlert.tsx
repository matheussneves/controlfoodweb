import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { Box } from '@mui/material';
import axios from 'axios';

export default function CardAlert() {
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    async function fetchEstoque() {
      try {
        const { data } = await axios.get('http://127.0.0.1:21229/estoque');
        const baixos = data.filter(item => item.quantidade < 5);
        setLowStockItems(baixos);
      } catch (error) {
        console.error('Erro ao carregar estoque:', error);
      }
    }
    fetchEstoque();
  }, []);

  if (lowStockItems.length === 0) return null;

  return (
    <Box>
      {lowStockItems.map(item => (
        <Card
          key={item.id}
          variant="outlined"
          sx={{ m: 1.5, p: 1.5 }}
        >
          <ReportGmailerrorredIcon fontSize="small" sx={{ mr: 1 }} />
          <CardContent sx={{ flex: '1 0 auto', p: 0 }}>
            <Typography gutterBottom sx={{ fontWeight: 600 }}>
              Estoque acabando: {item.descricao}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Seu estoque de {item.descricao} está com apenas {item.quantidade} unidades.
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
