import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import MainGrid from './components/MainGrid';
import SideMenu from './components/SideMenu';
import AppTheme from './theme/AppTheme';
import PagePedidos from './components/PagePedidos'; // Novo componente exemplo
import EntregasPage from './components/miniPage/EntregasPage';
import PratosPage from './components/miniPage/PratosPage';
import EstoquePage from './components/miniPage/EstoquePage';
import IngredientesPage from './components/IngredientesPage';
import ClientesPage from './components/miniPage/ClientesPage';
import UserPage from './components/UserPage';
import EntregadoresPage from './components/miniPage/EntregadoresPage';
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

  const renderComponent = () => {
    switch (selectedComponent) {
      //case 'PagePedidos':
      //  return <PagePedidos />;
       case 'EntregasPage':
         return <EntregasPage />;
      // case 'PratosPage':
      //   return <PratosPage />;
      // case 'EstoquePage':
      //   return <EstoquePage />;
      // case 'IngredientesPage':
      //   return <IngredientesPage />;
      // case 'ClientesPage':
      //   return <ClientesPage />;
      // case 'UserPage':
      //   return <UserPage />;
      // case 'EntregadoresPage':
      //   return <EntregadoresPage />;
      default:
        return <MainGrid />;
    }
  };

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />

        {/* Conteúdo principal dinâmico */}
        <Box
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
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
         {renderComponent()}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
