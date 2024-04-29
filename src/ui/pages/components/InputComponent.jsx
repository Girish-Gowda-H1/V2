import { Chip, Grid, MenuItem, TextField } from '@mui/material';

export default function InputComponent() {
  return (
    <Grid container flexDirection="column" spacing={2}>
      <Grid item>
        <h1>Input Fields</h1>
        <Chip label="type = `text`" sx={{ mb: 2 }} />
        <TextField label="Text" fullWidth />
      </Grid>
      <Grid item>
        <Chip label="disabled" sx={{ my: 2 }} />
        <TextField label="Disabled" disabled fullWidth />
      </Grid>
      <Grid item>
        <Chip label="select" sx={{ my: 2 }} />
        <TextField select label="Select" defaultValue="1" fullWidth placeholder="mytextfield">
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
          <MenuItem value="3">3</MenuItem>
        </TextField>
      </Grid>
      <Grid item>
        <Chip label={`multiline, minRows={5}, maxRows={Infinity}`} sx={{ my: 2 }} />
        <TextField label="Text Area" multiline minRows={5} maxRows={Infinity} fullWidth />
      </Grid>
    </Grid>
  );
}
