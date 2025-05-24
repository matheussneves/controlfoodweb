import * as React from 'react';
import { alpha } from '@mui/material/styles';
import {
  CssBaseline, Box, Stack, Button, Card, Typography, Grid,
  Chip
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

import { useNavigate } from "react-router-dom";
import { useAuth } from '../../apis/AuthContext';

// Layout e componentes visuais
import AppTheme from './theme/AppTheme';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import SideMenu from './components/SideMenu';

// Páginas do menu
import MainGrid from './components/MainGrid';
import PagePedidos from './components/miniPage/PagePedidos';
import PratosPage from './components/miniPage/PratosPage';
import EstoquePage from './components/miniPage/EstoquePage';
import IngredientesPage from './components/miniPage/IngredientesPage';
import ClientesPage from './components/miniPage/ClientesPage';
import UserPage from './components/miniPage/UserPage';
import EntregadoresPage from './components/miniPage/EntregadoresPage';

// Tema customizado
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props) {
  const [selectedComponent, setSelectedComponent] = React.useState('MainGrid');
  const { userid } = useAuth();
  console.log("userid", userid);
  const navigate = useNavigate();

  // Dados simulados (em breve virão da API)
  const lucroBruto = 20000;
  const lucroLiquido = 17000;
  const pedidosPendentes = 5;
  const pedidosConcluidos = 50;

  const chartData = React.useMemo(() => [
    { name: 'Jan', ganhos: 4000 },
    { name: 'Fev', ganhos: 3000 },
    { name: 'Mar', ganhos: 2000 },
    { name: 'Abr', ganhos: 2780 },
  ], []);

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Pedidos': return <PagePedidos />;
      case 'Pratos': return <PratosPage />;
      case 'Estoque': return <EstoquePage />;
      case 'Ingredientes': return <IngredientesPage />;
      case 'Clientes': return <ClientesPage />;
      case 'Usuarios': return <UserPage />;
      case 'Entregadores': return <EntregadoresPage />;
      default: return <MainGrid />;
    }
  };

  // if (!userid) {
  //   return (
  //     <AppTheme {...props} themeComponents={xThemeComponents}>
  //       <CssBaseline enableColorScheme />
  //       <Box sx={{ p: 3 }}>
  //         <Typography variant="h5" align="center" gutterBottom>
  //           Você precisa estar logado para acessar o painel.
  //         </Typography>
  //         <Button fullWidth variant="contained" color="primary" onClick={() => navigate("/")}>
  //           Login
  //         </Button>
  //       </Box>
  //     </AppTheme>
  //   );
  // }

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu userid={userid} setSelectedComponent={setSelectedComponent} />
        <AppNavbar />
        <Box component="main" sx={(theme) => ({
          flexGrow: 1,
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            : alpha(theme.palette.background.default, 1),
          overflow: 'auto',
        })}>
          <Stack spacing={2} sx={{ alignItems: 'center', mx: 3, pb: 5, mt: { xs: 8, md: 0 } }}>
            <Header breadcrumbComponent={selectedComponent} />

            {/* Dashboard principal */}
            {selectedComponent === 'MainGrid' && (
              <>
                {/* Big Numbers */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ p: 3 }}>
                      <Typography variant="h6" align="center">Lucro Bruto</Typography>
                      <Typography variant="h4" align="center" color="primary">
                        R$ {lucroBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ p: 3 }}>
                      <Typography variant="h6" align="center">Lucro Líquido</Typography>
                      <Typography variant="h4" align="center" color="secondary">
                        R$ {lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ p: 3 }}>
                      <Typography variant="h6" align="center">Pedidos Pendentes</Typography>
                      <Typography variant="h4" align="center" color="error">
                        {pedidosPendentes}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ p: 3 }}>
                      <Typography variant="h6" align="center">Pedidos Entregues</Typography>
                      <Typography variant="h4" align="center" color="success">
                        {pedidosConcluidos}
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>

                {/* Gráfico de lucros */}
                <Box sx={{ mt: 5, width: '100%' }}>
                  <Typography variant="h5" gutterBottom>Evolução de Lucros</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="ganhos" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </>
            )}

            {/* Conteúdo dinâmico (outros componentes) */}
            {renderComponent()}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}