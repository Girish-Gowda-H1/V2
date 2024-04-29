import { TextField } from '@mui/material';
import { useEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export default function FileInputField({ name, hasError, onChange: onInputChange, ...inputProps }) {
  const { register, setValue, control } = useFormContext();

  const fileRef = useRef();

  useEffect(() => {
    const fileValue = fileRef.current.children[0].children[0].value;
    setValue(name, fileValue);
  }, [name, setValue]);

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field: { onChange, onBlur } }) => (
        <TextField
          type="file"
          error={Boolean(hasError)}
          onBlur={onBlur}
          helperText={hasError ? 'Please select a file' : null}
          ref={fileRef}
          onChange={(e) => {
            setValue(name, e.target.value);
            onInputChange(e);
            onChange(e);
          }}
          {...inputProps}
        >
          <input type="text" hidden {...register(name)} />
        </TextField>
      )}
    />
  );
}
