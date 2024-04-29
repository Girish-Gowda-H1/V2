import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

export default function FormCheckboxField({ name, onChange: onInputChange = () => null, defaultValue, ...inputProps }) {
  const { control, getValues } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={(Boolean(getValues(name)) || defaultValue, false)}
      render={({ field: { onChange, onBlur } }) => {
        return (
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
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
