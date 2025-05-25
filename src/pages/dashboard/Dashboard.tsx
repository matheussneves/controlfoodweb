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
      case 'Pedidos': return <PagePedidos id="dashboard-page-pedidos" />;
      case 'Pratos': return <PratosPage id="dashboard-page-pratos" />;
      case 'Estoque': return <EstoquePage id="dashboard-page-estoque" />;
      case 'Ingredientes': return <IngredientesPage id="dashboard-page-ingredientes" />;
      case 'Clientes': return <ClientesPage id="dashboard-page-clientes" />;
      case 'Usuarios': return <UserPage id="dashboard-page-usuarios" />;
      case 'Entregadores': return <EntregadoresPage id="dashboard-page-entregadores" />;
      default: return <MainGrid id="dashboard-page-main-grid" />;
    }
  };

   if (!userid) {
     return (
       <AppTheme id="dashboard-app-theme-unauthenticated" {...props} themeComponents={xThemeComponents}>
         <CssBaseline id="dashboard-css-baseline-unauthenticated" enableColorScheme />
         <Box id="dashboard-unauthenticated-box" sx={{ p: 3 }}>
           <Typography id="dashboard-unauthenticated-message" variant="h5" align="center" gutterBottom>
             Você precisa estar logado para acessar o painel.
           </Typography>
           <Button
             id="dashboard-login-button"
             fullWidth
             variant="contained"
             color="primary"
             onClick={() => navigate("/")}
           >
             Login
           </Button>
         </Box>
       </AppTheme>
     );
   }

  return (
    <AppTheme id="dashboard-app-theme" {...props} themeComponents={xThemeComponents}>
      <CssBaseline id="dashboard-css-baseline" enableColorScheme />
      <Box id="dashboard-root-box" sx={{ display: 'flex' }}>
        <SideMenu id="dashboard-side-menu" userid={userid} setSelectedComponent={setSelectedComponent} />
        <AppNavbar id="dashboard-navbar" />
        <Box
          id="dashboard-main-content"
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            id="dashboard-stack"
            spacing={2}
            sx={{ alignItems: 'center', mx: 3, pb: 5, mt: { xs: 8, md: 0 } }}
          >
            <Header id="dashboard-header" breadcrumbComponent={selectedComponent} />

            {/* Dashboard principal */}
            {selectedComponent === 'MainGrid' && (
              <>
                <Grid id="dashboard-big-numbers-grid" container spacing={3}>
                  <Grid id="dashboard-lucro-bruto-grid" item xs={12} sm={6} md={3}>
                    <Card id="dashboard-lucro-bruto-card" sx={{ p: 3 }}>
                      <Typography id="dashboard-lucro-bruto-title" variant="h6" align="center">
                        Lucro Bruto
                      </Typography>
                      <Typography
                        id="dashboard-lucro-bruto-value"
                        variant="h4"
                        align="center"
                        color="primary"
                      >
                        R$ {lucroBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid id="dashboard-lucro-liquido-grid" item xs={12} sm={6} md={3}>
                    <Card id="dashboard-lucro-liquido-card" sx={{ p: 3 }}>
                      <Typography id="dashboard-lucro-liquido-title" variant="h6" align="center">
                        Lucro Líquido
                      </Typography>
                      <Typography
                        id="dashboard-lucro-liquido-value"
                        variant="h4"
                        align="center"
                        color="secondary"
                      >
                        R$ {lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid id="dashboard-pedidos-pendentes-grid" item xs={12} sm={6} md={3}>
                    <Card id="dashboard-pedidos-pendentes-card" sx={{ p: 3 }}>
                      <Typography id="dashboard-pedidos-pendentes-title" variant="h6" align="center">
                        Pedidos Pendentes
                      </Typography>
                      <Typography
                        id="dashboard-pedidos-pendentes-value"
                        variant="h4"
                        align="center"
                        color="error"
                      >
                        {pedidosPendentes}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid id="dashboard-pedidos-entregues-grid" item xs={12} sm={6} md={3}>
                    <Card id="dashboard-pedidos-entregues-card" sx={{ p: 3 }}>
                      <Typography id="dashboard-pedidos-entregues-title" variant="h6" align="center">
                        Pedidos Entregues
                      </Typography>
                      <Typography
                        id="dashboard-pedidos-entregues-value"
                        variant="h4"
                        align="center"
                        color="success"
                      >
                        {pedidosConcluidos}
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>

                <Box id="dashboard-chart-box" sx={{ mt: 5, width: '100%' }}>
                  <Typography id="dashboard-chart-title" variant="h5" gutterBottom>
                    Evolução de Lucros
                  </Typography>
                  <ResponsiveContainer id="dashboard-chart-container" width="100%" height={300}>
                    <LineChart id="dashboard-line-chart" data={chartData}>
                      <CartesianGrid id="dashboard-chart-grid" strokeDasharray="3 3" />
                      <XAxis id="dashboard-chart-xaxis" dataKey="name" />
                      <YAxis id="dashboard-chart-yaxis" />
                      <Tooltip id="dashboard-chart-tooltip" />
                      <Line
                        id="dashboard-chart-line"
                        type="monotone"
                        dataKey="ganhos"
                        stroke="#8884d8"
                      />
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