import { Pagination, PaginationItem, Typography } from '@mui/material';
import RightDirection from '@assets/svgs/RightDirection';
import LeftDirection from '@assets/svgs/LeftDirection';

export default function CustomPagination({
  size = 'large',
  count: itemCount = 10,
  page: currentPage,
  onChange: onPageChange = () => null,
  ...inputProps
}) {
  return (
    <Pagination
      size={size}
      count={itemCount}
      page={currentPage}
      onChange={onPageChange}
      renderItem={(item) => {
        return (
          <PaginationItem
            components={{
              previous: ForwardIcon,
              next: NextIcon,
            }}
            {...item}
          />
        );
      }}
      sx={{
        '& button': {
          background: 'transparent !important',
          fontSize: '16px',
          paddingX: '20px',
          '&:hover': {
            background: 'transparent !important',
          },
        },
        '& .Mui-selected': {
          color: '#9ea0a0 !important',
        },
        '& .MuiPaginationItem-previousNext': {
          paddingX: '3.5rem',
        },
      }}
      {...inputProps}
    />
  );
}

const ForwardIcon = () => {
  return (
    <>
      <LeftDirection />
      <Typography variant="h5" sx={{ ml: 2 }}>
        Previous
      </Typography>
    </>
  );
};

const NextIcon = () => {
  return (
    <>
      <Typography variant="h5" sx={{ mr: 2 }}>
        Next
      </Typography>
      <RightDirection />
    </>
  );
};
