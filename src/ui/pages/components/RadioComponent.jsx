import { Chip, FormControlLabel, FormGroup, Grid, Radio } from '@mui/material';
import CustomRadio from '@components/common/CustomRadio';
export default function RadioComponent() {
  return (
    <FormGroup>
      <h1>Radio Buttons</h1>
      <Grid container flexDirection="column">
        <Grid item>
          <Chip label="default" sx={{ mb: 2 }} />
        </Grid>
        <FormControlLabel control={<Radio />} label="Radio Button" />
        <Grid item>
          <Chip label="defaultChecked" sx={{ my: 2 }} />
        </Grid>
        <FormControlLabel control={<Radio defaultChecked />} label="Radio Button" />
      </Grid>
      <Grid item>
        <CustomRadio label="customized radioButton"/>
      </Grid>
    </FormGroup>
  );
}
