import CustomDatePicker from '@components/common/CustomDatePicker';
import { Box } from '@mui/material';
import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ChecklistResponseDateFilter({ onOk }) {
  const [searchParams] = useSearchParams();
  const startDate = useCallback(() => {
    const currentDate = searchParams.get('start_date');
    if (currentDate) {
      const dateArr = currentDate.split('/');
      return dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2];
    }
  }, [searchParams]);

  const endDate = useCallback(() => {
    const currentDate = searchParams.get('end_date');
    if (currentDate) {
      const dateArr = currentDate.split('/');
      return dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2];
    }
  }, [searchParams]);

  const [hasFilter, setHasFilter] = useState(startDate && endDate);

  return (
    <Box
      sx={{
        display: 'flex',
        cursor: 'pointer',
        '& .rs-picker > div': {
          background: hasFilter ? '#EBE3F1 !important' : '#ffffff !important',
          boxShadow: '0px 0px 6px #E0E0E0',
          borderColor: '#E0E0E0 !important',
          ':hover': {
            background: hasFilter ? '#EBE3F1' : '#ffffff',
            boxShadow: '0px 0px 6px #E0E0E0',
          },
        },
      }}
    >
      <CustomDatePicker
        placeholder="Date Filled"
        sx={{ width: 150 }}
        onOk={(dates) => {
          onOk(dates);
          setHasFilter(true);
        }}
        onReset={() => {
          setHasFilter(false);
          onOk([]);
        }}
        defaultValue={[startDate() ? new Date(startDate()) : null, endDate() ? new Date(endDate()) : null]}
      />
    </Box>
  );
}
