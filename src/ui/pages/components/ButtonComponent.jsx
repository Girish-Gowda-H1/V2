import { Grid, Button, Chip } from '@mui/material';
import { Fragment } from 'react';

export default function ButtonComponent() {
  return (
    <Fragment>
      <h1>Buttons</h1>
      <Grid container flexDirection="column" spacing={1}>
        <Grid item>
          <Chip label={`variant = "contained"`} sx={{ mb: 2 }} />
        </Grid>
        <Grid item>
          <Button variant="contained">Contained</Button>
        </Grid>
        <Grid item>
          <Chip label={`variant = "outlined"`} sx={{ mb: 2, mt: 4 }} />
        </Grid>
        <Grid item>
          <Button variant="outlined">Outlined</Button>
        </Grid>
        <Grid item>
          <Chip label={`variant = "text"`} sx={{ mb: 2, mt: 4 }} />
        </Grid>
        <Grid item>
          <Button variant="text">Text</Button>
        </Grid>


        <Grid item>
          <Button variant="rb-yellow-primary">rb-yellow-primary</Button>
        </Grid>

        <Grid item>
          <Button variant="rb-outlined">rb-outlined</Button>
        </Grid>


        <Grid item>
          <Button variant="rb-contained">rb-contained</Button>
        </Grid>

 
        <Grid item>
          <Button variant="rb-yellow-outlined">rb-yellow-outlined</Button>
        </Grid>

        <Grid item>
          <Button variant="rb-teal-contained">rb-teal-contained</Button>
        </Grid>

        <Grid item>
          <Button variant="rb-grey-contained">rb-grey-contained</Button>
        </Grid>

      </Grid>
    </Fragment>
  );
}
