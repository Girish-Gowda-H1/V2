import { Box, Grid } from '@mui/material';
import ButtonComponent from './ButtonComponent';
import InputComponent from './InputComponent';
import CheckboxComponent from './CheckboxComponent';
import RadioComponent from './RadioComponent';
import AudioPlayerComponent from './AudioPlayerComponent';
import TableComponent from './TableComponent';
import ModalComponent from './ModalComponent';

export default function Index() {
  return (
    <Box>
      <Grid container flexDirection="column" spacing={2}>
        {/* Component For Input */}
        <Grid item sm={6}>
          <InputComponent />
        </Grid>

        {/* Component For Checkbox */}
        <Grid item sm={6}>
          <CheckboxComponent />
        </Grid>

        {/* Component For Radio */}
        <Grid item sm={6}>
          <RadioComponent />
        </Grid>

        {/* Component For Button */}
        <Grid item sm={6}>
          <ButtonComponent />
        </Grid>

        {/* Component For Audio Player */}
        <Grid item sm={6}>
          <AudioPlayerComponent />
        </Grid>

        {/* Component For Table */}
        <Grid item sm={12}>
          <TableComponent />
        </Grid>

        {/* Component For Modal  */}
        <Grid item sm={4}>
          <ModalComponent />
        </Grid>
      </Grid>
    </Box>
  );
}
