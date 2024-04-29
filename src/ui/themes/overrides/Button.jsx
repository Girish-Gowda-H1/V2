// ==============================|| OVERRIDES - BUTTON ||============================== //
import '../fonts.css';

export default function Button(theme) {
  const { button } = theme.palette;

  const basicFontStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    lineHeight: '25px',
    letterSpacing: '1.75px',
    textTransform: 'uppercase',
  };

  const borderRadius = {
    rounded_md: '8px',
    rounded: '10px',
  };

  const boxShadow = {
    thick: `0px 0px 6px ${button.border.lightGray}`,
    bluryThick: `0px 0px 4px ${button.border.lightGray}`,
  };

  const border = {
    lightGrey: `1px solid ${button.border.lightGray}`,
    yellowPrimary: `3px solid ${button.border.yellowPrimary}`,
  };

  const disabledStyle = {
    '&.Mui-disabled': {
      backgroundColor: theme.palette.grey[200],
    },
  };

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          fontWeight: 400,
        },
        contained: {
          ...disabledStyle,
        },
        outlined: {
          ...disabledStyle,
        },
        text: {
          ...disabledStyle,
          color: button.text.blackPrimary,
          textDecoration: 'underline',
          ':hover': {
            textDecoration: 'underline',
          },
        },
      },
      variants: [
        {
          props: { variant: 'rb-yellow-primary' },
          style: {
            backgroundColor: button.yellowPrimary,
            color: button.text.blackPrimary,
            boxShadow: boxShadow.thick,
            borderRadius: borderRadius.rounded,
            padding: '14px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
            ':hover': {
              boxShadow: '0px 0px 6px #00000029',
              backgroundColor: button.yellowPrimary,
              color: button.text.textPrimary,
            },
          },
        },
        {
          props: { variant: 'rb-outlined' },
          style: {
            backgroundColor: button.whitePrimary,
            color: button.text.textPrimary,
            boxShadow: boxShadow.thick,
            border: border.lightGrey,
            borderRadius: borderRadius.rounded_md,
            padding: '18px 20px',
            fontSize: '11px',
            fontWeight: '600',
            lineHeight: '14px',
            textTransform: 'uppercase',
          },
        },
        {
          props: { variant: 'rb-contained' },
          style: {
            fontFamily: 'MulishMedium',
            backgroundColor: button.purplePrimary,
            color: button.text.purplePrimary,
            boxShadow: boxShadow.thick,
            border: border.lightGrey,
            borderRadius: borderRadius.rounded_md,
            padding: '11px 16px',
            fontSize: '11px',
            fontWeight: '600',
            lineHeight: '14px',
            letterSpacing: '.55px',
            textTransform: 'uppercase',
          },
        },
        {
          props: { variant: 'rb-yellow-outlined' },
          style: {
            ...basicFontStyle,
            backgroundColor: button.whitePrimary,
            color: button.text.greyText,
            boxShadow: boxShadow.thin,
            borderRadius: borderRadius.rounded,
            border: border.yellowPrimary,
            padding: '14px 56px',
            fontFamily: 'MulishMedium',
            ':hover': {
              transition: '0.2s',
              backgroundColor: button.whitePrimary,
              color: button.text.greyText,
            },
          },
        },
        {
          props: { variant: 'rb-teal-contained' },
          style: {
            ...basicFontStyle,
            backgroundColor: button.tealPrimary,
            color: button.whitePrimary,
            boxShadow: boxShadow.thin,
            borderRadius: borderRadius.rounded,
            padding: '14px 22px',
            fontFamily: 'MulishMedium',
            ':hover': {
              transition: '0.2s',
              backgroundColor: button.tealPrimary,
              color: button.whitePrimary,
            },
          },
        },
        {
          props: { variant: 'rb-grey-contained' },
          style: {
            ...basicFontStyle,
            backgroundColor: button.greyPrimary,
            color: button.text.greyText,
            boxShadow: boxShadow.thin,
            borderRadius: borderRadius.rounded,
            fontFamily: 'MulishMedium',
            padding: '14px 22px',
            ':hover': {
              transition: '0.2s',
              backgroundColor: button.greyPrimary,
              color: button.text.greyText,
            },
            '&.Mui-disabled': {
              color: button.text.greyText,
            },
          },
        },
      ],
    },
  };
}
