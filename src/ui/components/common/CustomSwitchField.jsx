import { FormControlLabel, FormGroup, Switch } from '@mui/material';

export default function CustomSwitchField({ label, defaultChecked, onChange, ...inputProps }) {
  return (
    <FormGroup>
      <FormControlLabel
        label={label}
        sx={{
          paddingLeft: '12px',
          '& h5': {
            marginLeft: 1,
          },
        }}
        control={<Switch onChange={onChange} defaultChecked={defaultChecked} {...inputProps} />}
      />
    </FormGroup>
  );
}
