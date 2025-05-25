// MenuContent.js
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';


const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, component: 'MainGrid' },
  { text: 'Pedidos', icon: <AnalyticsRoundedIcon />, component: 'PagePedidos' },
  { text: 'Pratos', icon: <AssignmentRoundedIcon />, component: 'PratosPage' },
  { text: 'Estoque', icon: <AssignmentRoundedIcon />, component: 'EstoquePage' },
  { text: 'Ingredientes', icon: <AssignmentRoundedIcon />, component: 'IngredientesPage' },
  { text: 'Clientes', icon: <PeopleRoundedIcon />, component: 'ClientesPage' },
];

const secondaryListItems = [
  { text: 'Usuarios', icon: <PeopleRoundedIcon />, component: 'UserPage' },
  { text: 'Entregadores', icon: <AssignmentRoundedIcon />, component: 'EntregadoresPage' },
];

interface MenuContentProps {
  setSelectedComponent: (component: string) => void;
}

export default function MenuContent({ setSelectedComponent }: MenuContentProps) {
  interface MenuItem {
    text: string;
    icon: React.ReactNode;
    component: string;
  }

  const handleMenuClick = (item: MenuItem): void => {
    setSelectedComponent(item.text);
  };
  return (
    <Stack id="menu-content-stack" sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List id="menu-content-main-list" dense>
        {mainListItems.map((item, index) => (
          <ListItem id={`menu-content-main-list-item-${index}`} key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton id={`menu-content-main-list-item-button-${index}`} onClick={() => handleMenuClick(item)}>
              <ListItemIcon id={`menu-content-main-list-item-icon-${index}`}>{item.icon}</ListItemIcon>
              <ListItemText id={`menu-content-main-list-item-text-${index}`} primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List id="menu-content-secondary-list" dense>
        {secondaryListItems.map((item, index) => (
          <ListItem id={`menu-content-secondary-list-item-${index}`} key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton id={`menu-content-secondary-list-item-button-${index}`} onClick={() => handleMenuClick(item)}>
              <ListItemIcon id={`menu-content-secondary-list-item-icon-${index}`}>{item.icon}</ListItemIcon>
              <ListItemText id={`menu-content-secondary-list-item-text-${index}`} primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
