import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import CustomizedDataGrid from './CustomizedDataGrid';

import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard, { StatCardProps } from './StatCard';



export default function MainGrid() {
  const date = new Date();
  return (
    <Box id="main-grid-box" sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
    
      <Typography id="main-grid-title" component="h2" variant="h6" sx={{ mb: 2 }}>
      Dashboard
      </Typography>
      <Grid
        id="main-grid-charts-container"
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        
        <Grid id="main-grid-sessions-chart" size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid id="main-grid-page-views-chart" size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid>
      <Typography id="main-grid-orders-title" component="h2" variant="h6" sx={{ mb: 2 }}>
        Pedidos
      </Typography>
      <Grid id="main-grid-orders-container" container spacing={2} columns={12}>
        
          <CustomizedDataGrid />
       
        
      </Grid>
      <Copyright id="main-grid-copyright" sx={{ my: 4 }} />
    </Box>
  );
}
