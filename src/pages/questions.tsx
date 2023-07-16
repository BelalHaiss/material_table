import React, { useCallback, useEffect, useMemo, useState } from 'react';

//MRT Imports
//import MaterialReactTable, { type MRT_ColumnDef } from 'material-react-table'; //default import deprecated
import {
  MaterialReactTable,
  type MRT_TableInstance,
  type MRT_ColumnDef,
  type MaterialReactTableProps,
  MRT_ColumnFiltersState,
  MRT_SortingState,
  MRT_PaginationState
} from 'material-react-table';

//Material UI Imports
import { Box, Button, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { Q_Data, Q_Response, Q_schema } from '@/types/question';
import { fetcher } from '@/util/fetcher';
import { questionTransformer } from '@/components/Q_Table/util/Q_table.util';

export type Employee = {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  salary: number;
  startDate: string;
  signatureCatchPhrase: string;
  avatar: string;
};

const Example = () => {
  //data and fetching state
  const [data, setData] = useState<Q_Data[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  //table state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 1,
    pageSize: 10
  });

  const columns = useMemo<MRT_ColumnDef<Q_Data>[]>(
    () => [
      {
        id: 'question', //id is still required when using accessorFn instead of accessorKey
        header: 'question',
        accessorKey: 'question'
      },
      {
        accessorKey: 'correctAnswer',
        // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
        header: 'Correct Answer',
        size: 200
        //custom conditional format and styling
      },
      {
        header: 'Choice 1',
        accessorFn: (row) => row.answer[0],
        id: 'choice1'
      },
      {
        header: 'Choice 2',
        accessorFn: (row) => row.answer[1],
        id: 'choice2'
      },
      {
        header: 'Difficulty',
        accessorKey: 'difficulty'
      },
      {
        header: 'Time',
        accessorKey: 'event'
      },
      {
        header: 'Level 1',
        id: 'level1',
        accessorFn: (row) => row.level1.join(',')
      },
      {
        header: 'Level 2',
        id: 'level2',
        accessorFn: (row) => row.level2.join(',')
      },
      {
        header: 'Level 3',
        id: 'level3',
        accessorFn: (row) => row.level3.join(',')
      },
      {
        header: 'Level 4',
        id: 'level4',
        accessorFn: (row) => row.level4.join(',')
      }
    ],
    []
  );
  const handleReset = useCallback((table: MRT_TableInstance<Q_Data>) => {
    table.reset();
    table.resetColumnOrder();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      const url = new URL('/question', process.env.NEXT_PUBLIC_SERVER_HOST);

      url.searchParams.set('limit', `${pagination.pageSize}`);

      url.searchParams.set('size', `${pagination.pageSize}`);
      url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      url.searchParams.set('globalFilter', globalFilter ?? '');
      url.searchParams.set('sorting', JSON.stringify(sorting ?? []));
      console.log(url);
      const response: Q_Response | null = await fetcher({ url: url.href });
      if (response) {
        console.log({ response });
        const transformdData = response.data.map((data) =>
          questionTransformer(data)
        );
        setData(transformdData);
      } else {
        setIsError(true);
      }

      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting
  ]);
  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      editingMode='row'
      enableEditing={true}
      enableColumnFilterModes
      enableColumnOrdering
      enableRowSelection
      manualFiltering
      manualPagination
      manualSorting
      muiToolbarAlertBannerProps={
        isError
          ? {
              color: 'error',
              children: 'Error loading data'
            }
          : undefined
      }
      onColumnFiltersChange={setColumnFilters}
      onGlobalFilterChange={setGlobalFilter}
      onPaginationChange={setPagination}
      onSortingChange={setSorting}
      rowCount={rowCount}
      state={{
        columnFilters,
        globalFilter,
        isLoading,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isRefetching,
        sorting
      }}
      positionToolbarAlertBanner='bottom'
      renderTopToolbarCustomActions={({ table }) => {
        const handleDeactivate = () => {
          table.getSelectedRowModel().flatRows.map((row) => {
            alert('deactivating ' + row.getValue('name'));
          });
        };

        const handleActivate = () => {
          table.getSelectedRowModel().flatRows.map((row) => {
            alert('activating ' + row.getValue('name'));
          });
        };

        const handleContact = () => {
          table.getSelectedRowModel().flatRows.map((row) => {
            alert('contact ' + row.getValue('name'));
          });
        };

        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              color='error'
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleDeactivate}
              variant='contained'
            >
              delete
            </Button>
            <Button
              color='warning'
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleActivate}
              variant='contained'
            >
              edit
            </Button>
            <Button
              color='info'
              onClick={() => handleReset(table)}
              variant='contained'
            >
              reset
            </Button>
          </div>
        );
      }}
    />
  );
};

export default Example;
