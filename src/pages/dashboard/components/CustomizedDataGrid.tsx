import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { columns, rows } from '../internals/data/gridData';

export default function CustomizedDataGrid() {
  return (
    <DataGrid
      autoHeight
      checkboxSelection
      rows={rows}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              id: "customized-data-grid-logic-operator-input",
              variant: 'outlined',
              size: 'small',
            },
            columnInputProps: {
              id: "customized-data-grid-column-input",
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              id: "customized-data-grid-operator-input",
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                id: "customized-data-grid-value-input",
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        },
      }}
    />
  );
}
