// ==============================|| OVERRIDES - CHECKBOX ||============================== //

export default function Checkbox(theme) {
  const { checkbox } = theme.palette;

  return {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: theme.palette.secondary[300],
        },
        // colorSecondary: {
        //   color: '# custom color',
        //   '&$checked': {
        //     color: '#custom color',
        //   },
        // },
      },
      variants: [
        {
          props: { variant: 'rb-purple-primary' },
          style: {
            '&.Mui-checked': {
              color: checkbox.purplePrimary,
            },
          },
        },
        {
          props: { variant: 'rb-purple-secondary' },
          style: {
            '&.MuiCheckbox-root': {
              opacity: '10%',
              paddingRight: 0,
            },
            '&.Mui-checked': {
              opacity: '100%',
              color: checkbox.purplePrimary,
            },
          },
        },
      ],
    },
  };
}
