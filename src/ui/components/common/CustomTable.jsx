// React
import { useEffect, useState } from 'react';

// External
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import CustomPagination from '@components/common/CustomPagination';

export default function CustomTable({
  tableData,
  itemCount,
  leftAlignedItems = [],
  onPageChange,
  onRowClick = () => null,
  updateQuery = () => null,
}) {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page_no')) || 1;

  const [page, setPage] = useState(currentPage);

  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    updateQuery('page_no', newPage);
    onPageChange();
  };

  useEffect(() => {
    if (currentPage) {
      setPage(currentPage);
    }
  }, [currentPage, searchParams]);

  const columns = tableData.map((item, index) => {
    if (index === 0) {
      return Object.keys(item)
        .map((key) => ({ id: key, label: key }))
        .filter((item) => item.id !== 'id');
    }
  })[0];

  const cellAlign = (key) => {
    if (leftAlignedItems.includes(key)) {
      return 'left';
    }
  };

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 5 }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={cellAlign(column.id) || 'center'} style={{ minWidth: column.minWidth }}>
                    <Typography variant="h4" fontSize="16px" sx={{ pl: 2 }}>
                      {column.label}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                    onClick={() => onRowClick(row.id)}
                    sx={{
                      ':hover': {
                        cursor: 'pointer',
                        boxShadow: `0px 0px 6px ${theme.palette.shadowPrimary} !important`,
                      },
                    }}
                  >
                    {columns.map((column) => {
                      const Value = row[column.id];
                      return (
                        <TableCell key={column.id} align={cellAlign(column.id) || 'center'} sx={{ pl: 2 }}>
                          {typeof Value === 'object' ? (
                            <Box sx={{ pl: 2 }}>{Value}</Box>
                          ) : (
                            <Typography fontWeight="bold" fontSize="14px" lineHeight="15px" sx={{ pl: 2 }}>
                              {String(Value)}
                            </Typography>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Grid container justifyContent="center">
        <CustomPagination size="large" count={itemCount} page={page} onChange={handleChangePage} />
      </Grid>
    </>
  );
}
