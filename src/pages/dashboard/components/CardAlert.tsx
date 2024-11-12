import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';

export default function CardAlert() {
  return (
    <Card variant="outlined" sx={{ m: 1.5, p: 1.5 }}>
      <CardContent>
        <ReportGmailerrorredIcon fontSize="small" />
        <Typography gutterBottom sx={{ fontWeight: 600 }}>
          Estoque acabando !
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Seu estoque de arroz está abaixo do limite minimo.
        </Typography>
      </CardContent>
    </Card>
  );
}
