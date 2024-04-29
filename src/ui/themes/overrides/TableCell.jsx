export default function TableCell(theme) {
  let boxShadow = {
    boxShadow: `0px 0px 6px ${theme.palette.table.Darkshadow}`,
  };
  return {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          fontWeight: 'bold',
          letterSpacing: '0.8px',
          padding: 12,
          borderBottom: '1px solid',
          borderBottomColor: theme.palette.grey[300],
        },
        head: {
          paddingTop: 25,
          paddingBottom: 20,
          backgroundColor: theme.palette.table.tableHeader,
          fontSize: '1rem',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: '1px solid',
          borderColor: theme.palette.grey[300],
          borderRadius: '15px',
          ...boxShadow,
        },
      },
    },
  };
}
