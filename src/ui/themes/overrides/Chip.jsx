// ==============================|| OVERRIDES - CHIP ||============================== //

export default function Chip(theme) {
  const { chip } = theme.palette;

  return {
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          '&:active': {
            boxShadow: 'none',
          },
          '&.MuiChip-outlinedDefault': {
            background: chip.defaultBackground,
            borderColor: chip.defaultBorder,
            color: chip.text.default,
          },
          '&.MuiChip-outlinedSuccess': {
            background: chip.successBackground,
            borderColor: chip.successBorder,
            color: chip.text.success,
          },
        },
      },
    },
  };
}
