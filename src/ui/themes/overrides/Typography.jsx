// ==============================|| OVERRIDES - TYPOGRAPHY ||============================== //
import '../fonts.css';

export default function Typography() {
  return {
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: 12,
        },
        h1: {
          fontFamily: 'MulishExtraBold',
        },
        h2: {
          fontFamily: 'MulishExtraBold',
        },
        h3: {
          fontFamily: 'MulishBold',
        },
        h4: {
          fontFamily: 'MulishBold',
        },
        h5: {
          fontFamily: 'MulishSemiBold',
        },
        h6: {
          fontFamily: 'MulishSemiBold',
        },
        body1: {
          fontFamily: 'MulishRegular',
        },
        body2: {
          fontFamily: 'MulishRegular',
        },
        subtitle1: {
          fontFamily: 'MulishLight',
        },
        subtitle2: {
          fontFamily: 'MulishLight',
        },
        mulishMedium: {
          fontFamily: 'MulishMedium',
        },
      },
    },
  };
}
