import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import {
  MaterialReactTable,
  type MRT_TableInstance,
  type MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_SortingState,
  MRT_PaginationState
} from 'material-react-table';

//Material UI Imports
import { Q_Data, Q_Response, Q_schema } from '@/types/question';
import { fetcher } from '@/util/fetcher';
import {
  difficulty,
  events,
  level1_tags,
  level2_tags,
  level3_tags,
  level4_tags,
  questionTransformer
} from '@/components/Q_Table/util/Q_table.util';
import { Button, Chip, IconButton, TextField } from '@mui/material';
import { deleteQuestions } from '@/components/Q_Table/util/Q_fetcher';
import { FlexCenter } from '@/components/customStyle/FlexCenter';
import { MUI_COLORS } from '@/types/mui';
import { UploadModal } from '@/components/Q_Table/Q_Upload';
const Example = () => {
  //data and fetching state
  const [editedData, setEditedData] = useState<
    Partial<Q_Data> & { _id: string }[]
  >([]);
  const [data, setData] = useState<Q_Data[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  //table state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const selectedRowIds = (table: MRT_TableInstance<Q_Data>) =>
    table.getSelectedRowModel().rows.map((data) => data.original._id);

  const isEditable = (id: string) => editedData.find((data) => data._id === id);
  const columns = useMemo<MRT_ColumnDef<Q_Data>[]>(
    () => [
      {
        id: 'question', //id is still required when using accessorFn instead of accessorKey
        header: 'question',
        Cell: ({ row }) => {
          const id = row.original._id;
          const editableField = isEditable(id);
          const fieldValue = row.original.question;
          if (!editableField) return <p>{fieldValue}</p>;
          <TextField
            // error={!!editableField?.question && editableField.question.length < 5}
            name='question'
            value={fieldValue}
            onChange={(e) =>
              setEditedData((arr) =>
                arr.map((old) => {
                  if (old._id !== id) return old;
                  return old;
                })
              )
            }
            variant='standard'
          />;
        }
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
        accessorKey: 'difficulty',
        filterVariant: 'select',
        filterSelectOptions: difficulty
      },
      {
        header: 'Time',
        accessorKey: 'event',
        filterVariant: 'select',
        filterSelectOptions: events
      },
      {
        header: 'Level 1',
        id: 'level1',
        Cell: ({ row }) => {
          return <TagsChips color='primary' tags={row.original.level1} />;
        },
        filterVariant: 'multi-select',
        filterSelectOptions: level1_tags
      },
      {
        header: 'Level 2',
        id: 'level2',

        Cell: ({ row }) => {
          return <TagsChips color='secondary' tags={row.original.level2} />;
        },
        accessorFn: (row) => row.level2.join(','),
        filterVariant: 'multi-select',
        filterSelectOptions: level2_tags
      },
      {
        header: 'Level 3',
        id: 'level3',
        Cell: ({ row }) => {
          return <TagsChips color='success' tags={row.original.level3} />;
        },
        filterVariant: 'multi-select',
        filterSelectOptions: level3_tags
      },
      {
        header: 'Level 4',
        id: 'level4',
        Cell: ({ row }) => {
          return <TagsChips color='success' tags={row.original.level4} />;
        },
        filterVariant: 'multi-select',
        filterSelectOptions: level4_tags
      }
    ],
    []
  );
  const handleReset = useCallback((table: MRT_TableInstance<Q_Data>) => {
    table.reset();
    table.resetColumnOrder();
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const url = new URL('/question', process.env.NEXT_PUBLIC_SERVER_HOST);
    url.searchParams.set('limit', `${pagination.pageSize}`);
    url.searchParams.set('page', `${pagination.pageIndex + 1}`);
    url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
    url.searchParams.set('globalFilter', globalFilter ?? '');
    url.searchParams.set('sorting', JSON.stringify(sorting ?? []));
    const response: Q_Response | null = await fetcher({ url: url.href });
    if (response) {
      const transformdData = response.data.map((data) =>
        questionTransformer(data)
      );
      setData(transformdData);
    } else {
      setIsError(true);
    }
    setIsLoading(false);
  };
  useEffect(() => {
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
        sorting
      }}
      positionToolbarAlertBanner='bottom'
      renderTopToolbarCustomActions={({ table }) => {
        const handleDelete = async () => {
          // open confirmation
          if (!confirm('delete selected rows')) return;
          const ids = selectedRowIds(table);
          await deleteQuestions(ids);
          fetchData();
        };
        const handleEdit = () => {
          const ids = selectedRowIds(table);
          setEditedData(ids.map((_id) => ({ _id })));
        };
        const handleReset = () => {
          table.reset();
          setEditedData([]);
          table.resetColumnOrder();
        };
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <IconButton
              aria-label='delete'
              color='error'
              disabled={!table.getIsSomeRowsSelected() || editedData.length > 0}
              onClick={handleDelete}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              aria-label='edit'
              color={editedData.length ? 'success' : 'warning'}
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleEdit}
            >
              {editedData.length === 0 ? <EditIcon /> : <SaveIcon />}
            </IconButton>
            <IconButton
              aria-label='reset'
              sx={{ color: '#4299E1' }}
              // disabled={!table.getIsSomeRowsSelected()}
              onClick={handleReset}
            >
              <UndoIcon />
            </IconButton>
            <UploadModal />
          </div>
        );
      }}
    />
  );
};

export default Example;

type ChisProps = { tags: string[]; color: MUI_COLORS };
export const TagsChips = ({ tags, color }: ChisProps) => {
  return (
    <FlexCenter sx={{ gap: 1, flexWrap: 'wrap' }}>
      {tags.map((label) => (
        <Chip color={color} size='small' label={label} key={label} />
      ))}
    </FlexCenter>
  );
};
