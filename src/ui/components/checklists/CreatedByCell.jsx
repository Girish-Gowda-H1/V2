// Internal
import { Grid, Typography } from '@mui/material';

// External
import dayjs from 'dayjs';

const CreatedByCell = ({ creator, date }) => {
  return (
    <Grid>
      <Typography variant="h4" fontWeight="bold" fontSize="12px" textTransform="capitalize">
        {creator}
      </Typography>
      <Typography variant="subtitle2" color="grey.600" fontWeight="bold">
        {dayjs(date).format('DD MMM YYYY')}
      </Typography>
    </Grid>
  );
};

export default CreatedByCell;
