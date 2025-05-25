import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: theme.palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

interface NavbarBreadcrumbsProps {
  breadcrumbComponent: React.ReactNode;
}

export default function NavbarBreadcrumbs({ breadcrumbComponent }: NavbarBreadcrumbsProps) {
  return (
    <StyledBreadcrumbs
      id="navbar-breadcrumbs"
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon id="navbar-breadcrumbs-separator" fontSize="small" />}
    >
      <Typography id="navbar-breadcrumbs-dashboard" variant="body1">Dashboard</Typography>
      <Typography id="navbar-breadcrumbs-current" variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
        {breadcrumbComponent}
      </Typography>
    </StyledBreadcrumbs>
  );
}
