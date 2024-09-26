import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';

const items = [
  {
    icon: <SettingsSuggestRoundedIcon />,
    title: 'Desempenho adaptável',
    description:
      'Nosso produto se ajusta facilmente às suas necessidades, aumentando a eficiência e simplificando suas tarefas.',
  },
  {
    icon: <ConstructionRoundedIcon />,
    title: 'Construído para durar',
    description:
      'Experimente uma durabilidade incomparável que vai além com um investimento duradouro.',
  },
  {
    icon: <ThumbUpAltRoundedIcon />,
    title: 'Ótima experiência do usuário',
    description:
      'Integre nosso produto à sua rotina com uma interface intuitiva e fácil de usar.',
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: 'Funcionalidade inovadora',
    description:
      'Fique à frente com recursos que estabelecem novos padrões, atendendo melhor às suas necessidades em evolução do que o resto.',
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: 'Suporte confiável',
    description:
      'Conte com nosso suporte ágil ao cliente, oferecendo uma assistência que vai além da compra.',
  },
  {
    icon: <QueryStatsRoundedIcon />,
    title: 'Precisão em cada detalhe',
    description:
      'Desfrute de um produto meticulosamente elaborado onde pequenos toques causam um impacto significativo na sua experiência geral.',
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: 'grey.900',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Vantagens
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
          Explore por que nosso produto se destaca: adaptabilidade, durabilidade,
            design amigável e inovação. Desfrute de suporte ao cliente confiável e
            precisão em cada detalhe.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: 'grey.800',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
