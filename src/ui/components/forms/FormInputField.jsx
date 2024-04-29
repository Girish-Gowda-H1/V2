import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { InputAdornment, TextField } from '@mui/material';
import { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export default function FormInputField({
  name,
  yupMessage,
  sx,
  startIcon: StartIcon,
  onChange: onInputChange = () => null,
  inputStyles,
  InputProps,
  uppercase,
  InputAdornmentLabel,
  ...inputProps
}) {
  const {

    control,
    formState: { errors },
    getValues,
  } = useFormContext();

  const currentError = errors[name.split('.')[0]] || null;

  const errorMessage = useCallback(() => {
    if (currentError) {
      if (currentError?.length) {
        return yupMessage;
      } else {
        return currentError.message;
      }
    }
    return '';
  }, [currentError, yupMessage]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur } }) => (
        <TextField
          onChange={(e) => {
            e.target.value = uppercase ? e.target.value.toUpperCase() : e.target.value;
            onInputChange(e);
            onChange(e);
          }}
          onBlur={onBlur}
          value={getValues(name) || ''}
          fullWidth
          InputProps={{
            sx: inputStyles,
            startAdornment: StartIcon ? (
              <InputAdornment position="start">
                <StartIcon />
              </InputAdornment>
            ) : null,
            endAdornment: (InputAdornmentLabel &&
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* <div style={{ height: '21px', backgroundColor: '#7ACCC4', width: '2px' }}></div> */}
                <InputAdornment className='input-adornment' style={{ borderLeft: '2px solid #7ACCC4', width: '70px', height: '21px', justifyContent: 'center', margin: "0", padding: '0 23px 0 32px' }} position="start">{InputAdornmentLabel}</InputAdornment>
              </div>
            ),
            ...InputProps,
          }}
          InputLabelProps={{
            shrink: false,
          }}
          SelectProps={{
            IconComponent: KeyboardArrowDownIcon,
          }}
          sx={{
            '& p': {
              marginLeft: 0,
            },
            ...sx,
          }}
          error={Boolean(errorMessage())}
          helperText={errorMessage() ? errorMessage() || 'Please validate this field' : null}
          {...inputProps}
        />
      )}
    />
  );
}
