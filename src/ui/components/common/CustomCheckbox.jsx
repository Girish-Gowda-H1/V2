import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

export default function CustomCheckbox({ label = '', ...inputProps }) {
  return (
    <FormGroup>
      <FormControlLabel control={<Checkbox {...inputProps} />} label={label} />
    </FormGroup>
  );
}
