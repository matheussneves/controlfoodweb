// Dashboard.js
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
import PagePedidos from './components/miniPage/PagePedidos';
import EntregasPage from './components/miniPage/EntregasPage';
import PratosPage from './components/miniPage/PratosPage';
import EstoquePage from './components/miniPage/EstoquePage';
import IngredientesPage from './components/miniPage/IngredientesPage';
import ClientesPage from './components/miniPage/ClientesPage';
import UserPage from './components/miniPage/UserPage';
import EntregadoresPage from './components/miniPage/EntregadoresPage';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../apis/AuthContext';

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';
import { Button } from '@mui/material';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props) {
  const [selectedComponent, setSelectedComponent] = React.useState('MainGrid');
  const { userid } = useAuth();
  const navigate = useNavigate();
  const renderComponent = () => {
    
    switch (selectedComponent) {
      case 'Pedidos':
        return <PagePedidos />;
      case 'Entrega':
        return <EntregasPage />;
      case 'Pratos':
        return <PratosPage />;
      case 'Estoque':
        return <EstoquePage />;
      case 'Ingredientes':
        return <IngredientesPage />;
      case 'Clientes':
        return <ClientesPage />;
      case 'Usuarios':
        return <UserPage />;
      case 'Entregadores':
        return <EntregadoresPage />;
      default:
        return <MainGrid />;
    }
  };
 
  if (userid !== null) {
  return (
   
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu userid={userid} setSelectedComponent={setSelectedComponent} /> {/* Passa o setSelectedComponent como prop */}
        <AppNavbar />

       
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
            <Header breadcrumbComponent={selectedComponent}  />
            {renderComponent()}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  
  );
} else {return (
   
  <AppTheme {...props} themeComponents={xThemeComponents}>
    <CssBaseline enableColorScheme />
    <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          onClick={ () => {navigate("/")}}
          
          >
            Login
          </Button>
  </AppTheme>

);}
}
