// ==============================|| OVERRIDES - PAPER ||============================== //

import '../fonts.css';

export default function Paper(theme) {
  const { paper } = theme.palette;

  return {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          boxShadow: '0px 0px 6px ' + paper.shadowPrimary,

          '& .MuiList-root': {
            padding: '1rem',
            borderRadius: '8px',
            '& .MuiMenuItem-root': {
              ':focus': {
                borderRadius: '8px',
                background: 'transparent',
              },
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
                background: `${theme.palette.purpleSecondary}`,
              },
            },
          },

          '& .MuiAutocomplete-listbox': {
            padding: '8px 1rem',
          },

          '& .MuiAutocomplete-option': {
            background: `transparent !important`,
            marginBottom: '4px',
            borderRadius: '5px',

            ':hover': {
              borderRadius: '5px',
              background: `${theme.palette.purpleSecondary} !important`,
            },
          },
        },
      },
    },
  };
}
