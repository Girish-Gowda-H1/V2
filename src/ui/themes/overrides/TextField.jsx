// ==============================|| OVERRIDES - TEXTFIELD ||============================== //
import '../fonts.css';

export default function TextField(theme) {
  const { input } = theme.palette;

  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          '&.no-border': {
            '& fieldset': {
              border: 'none',
            },
            '& input': {
              padding: '0',
              // paddingRight: '0',
            },
            '& .MuiInputBase-input:hover + fieldset': {
              border: `none`,
            },
            '& .MuiInputBase-input:focus + fieldset': {
              border: `none`,
            },
            '& .Mui-focused': {
              boxShadow: `none`,
            },
          },

          '&.only-border': {
            '& fieldset': {
              border: 'none !important',
              borderBottom: '1px solid #D4D4D4 !important',
              // borderBottomColor: input.borderBottom,
              borderRadius: 0,
            },
            '& .MuiInputBase-input:hover + fieldset': {
              border: `none`,
            },
            '& .MuiInputBase-input:focus + fieldset': {
              border: 'none',
              borderBottom: '1px solid',
              borderBottomColor: input.borderBottom,
            },
            '& .MuiInputBase-root': {
              padding: 0,
              '& input': {
                paddingLeft: '0',
              },
              '& textarea': {
                lineHeight: '30px',
                fontSize: '20px',
                color: input.text.blackSecondary,
              },
              '&:hover': {
                '& fieldset': {
                  border: `none`,
                  borderBottom: '1px solid',
                  borderBottomColor: input.borderBottom,
                },
              },
            },
            '& .MuiInputBase-root:focus + textarea': {
              border: `none`,
            },
            '& .Mui-focused': {
              boxShadow: `none`,
            },
          },

          /////////////  Primary button

          '&.rb-primary': {
            '& .MuiInputBase-root': {
              padding: '14px 20px',
              boxShadow: '0px 0px 6px' + input.shadowPrimary,
              borderRadius: '10px',
              height: '100%',
            },
            '& input': {
              color: input.text.textPrimary,
              fontSize: '14px',
              padding: '0',
            },

            // Removed Border From TextField

            '& fieldset': {
              border: `none !important`,
              boxShadow: '0px 0px 6px #00000029 !important',
            },
            '& .MuiInputBase-input:focus + fieldset': {
              border: `none !important`,
              boxShadow: '0px 0px 6px #00000029 !important',
            },
            '& .MuiInputBase-root:focus + fieldset': {
              border: `none !important`,
              boxShadow: '0px 0px 6px #00000029 !important',
            },
          },

          '&.rb-primary-select': {
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
              letterSpacing: '0.8px',
              lineHeight: '22px',
              color: '#222222',
              fontSize: '16px',
              fontFamily: 'MulishSemiBold',
            },

            '& fieldset': {
              display: 'none',
            },
          },

          '& input, textarea': {
            fontFamily: 'MulishMedium',
          },
        },
      },
    },
  };
}
