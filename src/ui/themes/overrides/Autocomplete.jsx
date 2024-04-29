// ==============================|| OVERRIDES - AUTOCOMPLETE ||============================== //

export default function Autocomplete(theme) {
  const { input } = theme.palette;

  return {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          fontWeight: 400,

          '& :hover': {
            cursor: 'pointer',
          },

          // End Adroenment pushed to the center
          '& .MuiAutocomplete-endAdornment': {
            top: '50%',
            transform: 'translateY(-50%)',
          },

          '& .MuiOutlinedInput-root, & .MuiOutlinedInput-root:hover, & .MuiOutlinedInput-root.Mui-focused': {
            '& fieldset': {
              border: `1px solid #e0e0e0 !important`,
            },
          },

          '& .MuiFormLabel-colorPrimary': {
            color: `#757575 !important`,
          },

          '&.rb-primary-autocomplete': {
            '& .MuiInputBase-root': {
              boxShadow: '0px 0px 6px' + input.shadowPrimary,
              borderRadius: '10px',
              height: '100%',
            },
            '& input': {
              color: input.text.textPrimary,
              fontSize: '14px',
              padding: '0',
            },
            '& .MuiInputBase-input': {
              display: 'flex',
              alignItems: 'center',
            },
            '& label': {
              transform: 'translateY(-50%)',
              top: '50%',
              paddingLeft: '20px',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              lineHeight: '22px',
            },
            '& .MuiList-root': {
              padding: '1rem',
              borderRadius: '8px',
              '& .MuiMenuItem-root': {
                ':hover': {
                  borderRadius: '8px',
                  background: theme.palette.purpleSecondary,
                },
              },
              '& .Mui-selected': {
                background: 'none !important',
                borderRadius: '8px',
                ':hover': {
                  borderRadius: '8px',
                  background: `${theme.palette.purpleSecondary} !important`,
                },
              },
            },
          },
        },
      },
    },
  };
}
