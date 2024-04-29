import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

export default function FormSwitchField({ name, label, noPointerEvents = false, onChange: onInputChange = () => null, ...inputProps }) {
  const { control, getValues } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={Boolean(getValues(name)) || false}
      render={({ field: { onChange, onBlur } }) => {
        return (
          <FormGroup>
            <FormControlLabel
              label={label}
              sx={{
                paddingLeft: '12px',
                '& h5': {
                  marginLeft: 1,
                },
                pointerEvents: noPointerEvents ? 'none' : 'auto',
              }}
              control={
                <Switch
                  onChange={(event) => {
                    onInputChange(event);
                    onChange(event);
                  }}
                  checked={Boolean(getValues(name))}
                  onBlur={onBlur}
                  {...inputProps}
                />
              }
            />
          </FormGroup>
        );
      }}
    />
  );
}
