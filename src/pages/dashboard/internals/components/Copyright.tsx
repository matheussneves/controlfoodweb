import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function Copyright(props: any) {
  return (
    <Typography
      id="copyright-typography"
      variant="body2"
      align="center"
      {...props}
      sx={[
        {
          color: 'text.secondary',
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      {'Copyright © '}
      <Link id="copyright-link" color="inherit" href="http://www.controlfood.kinghost.net/">
        Control Food
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
