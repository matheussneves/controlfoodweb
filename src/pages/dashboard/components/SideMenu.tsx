import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import OptionsMenu from './OptionsMenu';
import { getUserById } from '../../../apis/requests';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

interface SideMenuProps {
  userid: string;
  setSelectedComponent: (component: string) => void;
}

export default function SideMenu({ userid, setSelectedComponent }: SideMenuProps) {
  const [user, setUser] = useState<{ nome?: string; email?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userid) {
          const response = await getUserById(userid);
          setUser(response);
        }
      } catch (error) {
        setUser({ nome: 'Erro', email: 'Erro ao carregar usuário' });
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUser();
  }, [userid]);

  return (
    <Drawer
      id="side-menu-drawer"
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        id="side-menu-header-box"
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      />
      <Divider id="side-menu-divider" />
      <MenuContent setSelectedComponent={setSelectedComponent} />
      <CardAlert />
      <Stack
        id="side-menu-footer-stack"
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          id="side-menu-avatar"
          sizes="small"
          alt={user?.nome || 'Usuário'}
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box id="side-menu-user-info-box" sx={{ mr: 'auto' }}>
          <Typography id="side-menu-user-name" variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {user?.nome || 'Carregando...'}
          </Typography>
          <Typography id="side-menu-user-email" variant="caption" sx={{ color: 'text.secondary' }}>
            {user?.email || 'Carregando...'}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
