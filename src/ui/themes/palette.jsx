// material-ui
import { createTheme } from '@mui/material/styles';

import { red, grey } from '@mui/material/colors';

// ==============================|| DEFAULT COLORS  ||============================== //

// Colors
const allMainTextColor = '#222222';
const blackPrimary = '#000000';
const accentGrey = '#9ea0a0';
const whitePrimary = '#ffffff';
const purplePrimary = '#4B3D76';
const purpleSecondary = '#EBE3F1';
const yellowPrimary = '#FED250';
const yellowSecondary = '#FFEBAF';
const redPrimary = '#FF6241';
const cyanPrimary = '#7ACCC4';

// Shadows
const shadowPrimary = '#00000029'; // For Buttons, Inputs etc.
const shadowSecondary = '#00000034'; // For Cards etc.
const Darkshadow = '#00000040'; //for container

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (mode) => {
  return createTheme({
    palette: {
      mode,
      common: {
        black: blackPrimary,
        white: whitePrimary,
      },

      // Colors
      allMainTextColor,
      accentGrey,
      cyanPrimary,
      grey,
      purplePrimary,
      purpleSecondary,
      yellowPrimary,
      yellowSecondary,
      redPrimary,

      // Shadows
      shadowPrimary,
      shadowSecondary,

      // Colors for Button

      button: {
        yellowPrimary: '#FED250',
        tealPrimary: '#307E98',
        greyPrimary: '#DDDDDD',
        purplePrimary: '#EBE3F1',
        blackPrimary,
        whitePrimary,
        text: {
          purplePrimary: '#4B3D76',
          blackPrimary,
          greyText: '#5C5C5C',
        },
        border: {
          lightBlack: '#00000029',
          lightGray: '#E0E0E0',
          yellowPrimary: '#FFDD7C',
        },
      },

      radio: {
        purplePrimary: '#4B3D76',
      },

      table: {
        tableHeader: '#EEEEEE',
        Darkshadow,
      },

      // Colors for Card

      card: {
        shadowSecondary,
      },

      // Colors for TextField

      input: {
        shadowPrimary,
        borderBottom: '#D4D4D4', // For Elelments with only border
        text: {
          blackPrimary,
          blackSecondary: '#222222',
        },
      },

      // Colors For Chip

      chip: {
        defaultBackground: '#EEEEEE',
        defaultBorder: '#7A7A7A',
        successBackground: '#E6F9DA',
        successBorder: '#5DC701',
        text: {
          default: '#5C5C5C',
          success: '#2D9B00',
        },
      },

      // Colors For Svg Icons

      svg: {
        defaultBackground: blackPrimary,
        disabledBackground: grey[300],
      },

      // Colors For Checkboxes

      checkbox: {
        purplePrimary,
      },

      // Colors For Paper

      paper: {
        shadowPrimary,
      },

      // Colors For Switch

      switch: {
        trackPrimary: whitePrimary,
        thumbPrimary: purplePrimary,
        thumbOff: accentGrey,
        trackSecondary: '#EEEEEE',
        thumbOffSecondary: accentGrey,
        thumbSecondary: purplePrimary,
        labelOff: '#5c5c5c',
        labelOn: purplePrimary,
      },

      // Colors for Modal

      modal: {
        backgroundPrimary: grey[300],
      },

      text: {
        primary: grey[900],
        secondary: grey[600],
        disabled: grey[400],
      },
      action: {
        disabled: grey[300],
        delete: { primary: red[600], hover: red[800] },
      },
      divider: grey[200],
      background: {
        paper: grey[0],
        default: grey.A50,
      },
    },
  });
};

export default Palette;
