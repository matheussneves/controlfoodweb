import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CustomDatePicker from './CustomDatePicker';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '.././theme/ColorModeIconDropdown';
interface HeaderProps {
  breadcrumbComponent: React.ReactNode;
}

export default function Header({ breadcrumbComponent }: HeaderProps) {

  return (
    <Stack
      id="header-stack"
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs breadcrumbComponent={breadcrumbComponent} />
      <Stack id="header-actions-stack" direction="row" sx={{ gap: 1 }}>
        <CustomDatePicker/>
        <ColorModeIconDropdown/>
      </Stack>
    </Stack>
  );
}
