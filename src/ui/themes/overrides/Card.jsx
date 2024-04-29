// ==============================|| OVERRIDES - CARD CONTENT ||============================== //

export default function Card() {
  return {
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 20,
          '&:last-child': {
            paddingBottom: 20,
          },
        },
      },
    },
  };
}
