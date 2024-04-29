import { Radio, FormControlLabel, FormGroup } from '@mui/material';

export default function CustomRadio({ label = '', ...inputProps }) {
  return (
    <FormGroup>
      <FormControlLabel control={<Radio {...inputProps} />} label={label} />
    </FormGroup>
  );
}
