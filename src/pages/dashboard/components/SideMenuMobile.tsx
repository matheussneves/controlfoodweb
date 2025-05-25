import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';

import MenuButton from './MenuButton';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile(
  { open, toggleDrawer }: SideMenuMobileProps,
  { setSelectedComponent }: { setSelectedComponent: (component: string) => void }
) {

  return (
    <Drawer
      id="side-menu-mobile-drawer"
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
      backgroundImage: 'none',
      backgroundColor: 'background.paper',
    },
      }}
    >
      <Stack id="side-menu-mobile-stack" sx={{ maxWidth: '70dvw', height: '100%' }}>
        <Stack id="side-menu-mobile-header" direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            id="side-menu-mobile-user-info"
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            <Avatar
              id="side-menu-mobile-avatar"
              sizes="small"
              alt="Riley Carter"
              src="/static/images/avatar/7.jpg"
              sx={{ width: 24, height: 24 }}
            />
            <Typography id="side-menu-mobile-user-name" component="p" variant="h6">
              Riley Carter
            </Typography>
          </Stack>
          <MenuButton id="side-menu-mobile-notifications-button" showBadge>
            <NotificationsRoundedIcon id="side-menu-mobile-notifications-icon" />
          </MenuButton>
        </Stack>
        <Divider id="side-menu-mobile-divider-header" />
        <Stack id="side-menu-mobile-content" sx={{ flexGrow: 1 }}>
          <MenuContent  setSelectedComponent={setSelectedComponent} />
          <Divider id="side-menu-mobile-divider-content" />
        </Stack>
        <CardAlert />
        <Stack id="side-menu-mobile-footer" sx={{ p: 2 }}>
          <Button
            id="side-menu-mobile-logout-button"
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon id="side-menu-mobile-logout-icon" />}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
