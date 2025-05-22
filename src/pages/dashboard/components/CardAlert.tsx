import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { Box, Typography } from '@mui/material';
import axios from 'axios';

// Tipos para os dados que estamos recebendo
interface ItemEstoque {
  id: string; // ou number, depende da sua API
  quantidade: number;
  quantidade_minima: number; // Adicionei essa propriedade para fazer a comparação
  ingrediente_Id_ingrediente: string; // Relacionamento com o ingrediente
}

interface Ingrediente {
  id_ingrediente: string; // ou number, depende da sua API
  descricao: string;
}

export default function CardAlert() {
  const [lowStockItems, setLowStockItems] = useState<ItemEstoque[]>([]); // Itens de estoque
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]); // Ingredientes
  const [error, setError] = useState<string | null>(null); // Para exibir erros

  useEffect(() => {
    // Função para buscar os dados do estoque e dos ingredientes
    async function fetchEstoqueAndIngredientes() {
      try {
        // Fazendo requisição para o estoque
        const { data: estoqueData } = await axios.get('https://controlfoodapi-d8a49e8667a8.herokuapp.com/estoque');
        
        // Fazendo requisição para os ingredientes
        const { data: ingredientesData } = await axios.get('https://controlfoodapi-d8a49e8667a8.herokuapp.com/ingredientes');

        // Armazenando os dados dos ingredientes
        setIngredientes(ingredientesData);

        // Filtrando os itens de estoque com quantidade baixa
        const baixos = estoqueData.filter((item: ItemEstoque) => item.quantidade < item.quantidade_minima);
        setLowStockItems(baixos);
      } catch (error) {
        console.error('Erro ao carregar estoque ou ingredientes:', error);
        setError('Não foi possível carregar os itens do estoque ou ingredientes.');
      }
    }

    fetchEstoqueAndIngredientes();
  }, []);

  // Caso não haja itens com estoque baixo, não renderiza nada
  if (lowStockItems.length === 0) return <Typography variant="body2" color="textSecondary">Não há itens com estoque baixo.</Typography>;

  // Exibe uma mensagem de erro, se ocorrer
  if (error) return <Typography variant="body2" color="error">{error}</Typography>;

  // Função para obter a descrição do ingrediente pelo id
  const getIngredienteDescricao = (idIngrediente: string) => {
    const ingrediente = ingredientes.find((i) => i.id_ingrediente === idIngrediente);
    if (!ingrediente) {
      console.warn(`Ingrediente com id ${idIngrediente} não encontrado.`);
      return 'Bacon';
    }
    return ingrediente.descricao;
  };

  return (
    <Box>
      {lowStockItems.map((item) => (
        <Card
          key={item.id}  // Cada item agora tem uma chave única
          variant="outlined"
          sx={{ m: 1.5, p: 1.5 }}
        >
          <ReportGmailerrorredIcon fontSize="small" sx={{ mr: 1 }} />
          <CardContent sx={{ flex: '1 0 auto', p: 0 }}>
            <Typography gutterBottom sx={{ fontWeight: 600 }}>
              Estoque acabando!
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Seu estoque de {getIngredienteDescricao(item.ingrediente_Id_ingrediente)} está com apenas {item.quantidade} unidades.
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
