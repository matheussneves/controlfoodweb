import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { GridCellParams, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

type SparkLineData = number[];

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function renderSparklineCell(params: GridCellParams<SparkLineData, any>) {
  const data = getDaysInMonth(4, 2024);
  const { value, colDef } = params;

  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <SparkLineChart
        data={value}
        width={colDef.computedWidth || 100}
        height={32}
        plotType="bar"
        showHighlight
        showTooltip
        colors={['hsl(210, 98%, 42%)']}
        xAxis={{
          scaleType: 'band',
          data,
        }}
      />
    </div>
  );
}

function renderStatus(status: 'Entregue' | 'Pendente') {
  const colors: { [index: string]: 'success' | 'default' } = {
    Entregue: 'success',
    Pendente: 'default',
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}

export function renderAvatar(
  params: GridCellParams<{ name: string; color: string }, any, any>,
) {
  if (params.value == null) {
    return '';
  }

  return (
    <Avatar
      sx={{
        backgroundColor: params.value.color,
        width: '24px',
        height: '24px',
        fontSize: '0.85rem',
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

export const columns: GridColDef[] = [
  { field: 'pageTitle', headerName: 'Prato', flex: 1.5, minWidth: 200 },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.5,
    minWidth: 100,
    renderCell: (params) => renderStatus(params.value as any),
  },
  {
    field: 'users',
    headerName: 'Entregador',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'eventCount',
    headerName: 'Pagamento',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'viewsPerUser',
    headerName: 'Valor',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'averageTime',
    headerName: 'Tempo',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 100,
  },
 
];

export const rows: GridRowsProp = [
  {
    id: 1,
    pageTitle: 'Lasanha',
    status: 'Entregue',
    eventCount: "Pix",
    users: "Robson",
    viewsPerUser: 18.50,
    averageTime: '29m',
   
  },
  {
    id: 2,
    pageTitle: 'Omelete',
    status: 'Entregue',
    eventCount: "Crédito",
    users: "Larissa",
    viewsPerUser: 93.7,
    averageTime: '23m',
   
  },
  {
    id: 3,
    pageTitle: 'Bife a cavalo',
    status: 'Pendente',
    eventCount: "Pix",
    users: 'Claudio',
    viewsPerUser: 15.2,
    averageTime: '23m',
  
  },
  {
    id: 4,
    pageTitle: 'Omelete',
    status: 'Entregue',
    eventCount: "Pix",
    users: "Silvio",
    viewsPerUser: 40.5,
    averageTime: '20m',

  },
  {
    id: 5,
    pageTitle: 'Omelete',
    status: 'Pendente',
    eventCount: "Pix",
    users: 'Robson',
    viewsPerUser: 37.1,
    averageTime: '28m',

  },
  {
    id: 6,
    pageTitle: 'Lasanha',
    status: 'Entregue',
    eventCount: "Débito",
    users: "Silvio",
    viewsPerUser: 74.2,
    averageTime: '22m',
  
  },
  {
    id: 7,
    pageTitle: 'Bife a cavalo',
    status: 'Pendente',
    eventCount: "Dinheiro",
    users: "Silvio",
    viewsPerUser: 62.5,
    averageTime: '27m',
   
  },
  {
    id: 8,
    pageTitle: 'Bife a cavalo',
    status: 'Entregue',
    eventCount: "Crédito",
    users: "Larissa",
    viewsPerUser: 44.3,
    averageTime: '31m',
 
  },
  {
    id: 9,
    pageTitle: 'Lasanha',
    status: 'Pendente',
    eventCount: "Crédito",
    users: "Claudio",
    viewsPerUser: 26.7,
    averageTime: '32m',

  },
  
];
