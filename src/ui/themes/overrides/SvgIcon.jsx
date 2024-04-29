// ==============================|| OVERRIDES - SVG ICON ||============================== //

export default function SvgIcon(theme) {
  const { svg } = theme.palette;

  return {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          '&.MuiSvgIcon-colorBlack': {
            fill: svg.defaultBackground,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled svg': {
            fill: svg.disabledBackground,
          },
        },
      },
    },
  };
}
