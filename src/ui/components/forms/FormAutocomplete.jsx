// Mui
import { Autocomplete, TextField } from '@mui/material';

// React Hook form
import { Controller, useFormContext } from 'react-hook-form';

export default function FormAutocomplete({ name, onChange: onInputChange = () => null, options, yupMessage, placeholder, ...inputProps }) {
  const {
    control,

    formState: { errors },
    setValue,
  } = useFormContext();

  const hasError = errors[name] || yupMessage;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur } }) => {
        return (
          <Autocomplete
            onChange={(event, value) => {
              onInputChange(event, value);
              onChange(event);
              setValue(name, value);
            }}
            filterSelectedOptions
            multiple
            options={options}
            onBlur={onBlur}
            fullWidth
            renderInput={(params) => {
              return <TextField {...params} placeholder={placeholder} error={hasError} helperText={hasError ? yupMessage : null} />;
            }}
            {...inputProps}
          />
        );
      }}
    />
  );
}
