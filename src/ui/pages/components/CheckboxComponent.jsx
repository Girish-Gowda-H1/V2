import { Checkbox, Chip, FormControlLabel, FormGroup, Grid } from '@mui/material';

export default function CheckboxComponent() {
  return (
    <FormGroup>
      <h1>Checkbox</h1>
      <Grid container flexDirection="column">
        <Grid item>
          <Chip label="default" sx={{ my: 2 }} />
        </Grid>
        <FormControlLabel control={<Checkbox />} label="Checkbox" />
        <Grid item>
          <Chip label="defaultChecked" sx={{ my: 2 }} />
        </Grid>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Checked" />
      </Grid>
    </FormGroup>
  );
}
