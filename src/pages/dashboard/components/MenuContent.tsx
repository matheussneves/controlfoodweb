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
  { text: 'Entrega', icon: <AssignmentRoundedIcon />, component: 'EntregasPage' },
  { text: 'Pratos', icon: <AssignmentRoundedIcon />, component: 'PratosPage' },
  { text: 'Estoque', icon: <AssignmentRoundedIcon />, component: 'EstoquePage' },
  { text: 'Ingredientes', icon: <AssignmentRoundedIcon />, component: 'IngredientesPage' },
  { text: 'Clientes', icon: <PeopleRoundedIcon />, component: 'ClientesPage' },
];

const secondaryListItems = [
  { text: 'Usuarios', icon: <PeopleRoundedIcon />, component: 'UserPage' },
  { text: 'Entregadores', icon: <AssignmentRoundedIcon />, component: 'EntregadoresPage' },
];

export default function MenuContent({ onSelectComponent }) {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={index === 0} onClick={() => onSelectComponent(item.component)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => console.log(item.component)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
