import * as React from 'react';
import Badge, { badgeClasses } from '@mui/material/Badge';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';

export interface MenuButtonProps extends IconButtonProps {
  showBadge?: boolean;
}

export default function MenuButton({
  showBadge = false,
  ...props
}: MenuButtonProps) {
  return (
    <Badge
      id="menu-button-badge"
      color="error"
      variant="dot"
      invisible={!showBadge}
      sx={{ [`& .${badgeClasses.badge}`]: { right: 2, top: 2 } }}
    >
      <IconButton id="menu-button-icon" size="small" {...props} />
    </Badge>
  );
}
