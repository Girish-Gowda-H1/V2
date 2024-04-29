import { Grid, Typography } from '@mui/material';

export default function InputWithName({ name, children, titleProps, ...inputProps }) {
  return (
    <Grid container alignItems="start" spacing={2} {...inputProps}>
      <Grid item sx={{ mt: 1.5 }} sm={4}>
        <Typography variant="h5" fontWeight="bold" {...titleProps}>
          {name}
        </Typography>
      </Grid>
      <Grid item sm={8}>
        {children}
      </Grid>
    </Grid>
  );
}
