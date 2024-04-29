// ==============================|| OVERRIDES - RADIO BUTTON ||============================== //

export default function Radio(theme) {

  let {radio} = theme.palette 

    return {
      MuiRadio: {
        styleOverrides: {
          root: {
            color: radio.purplePrimary,
            '&.Mui-checked': {
              color: radio.purplePrimary, 
            },
          }
        }
      }
    };
  }
  