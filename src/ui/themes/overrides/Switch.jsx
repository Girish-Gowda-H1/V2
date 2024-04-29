// ==============================|| OVERRIDES - BUTTON ||============================== //

export default function Switch(theme) {
  const { switch: muiSwitch } = theme.palette;

  return {
    MuiSwitch: {
      variants: [
        {
          props: { variant: 'rb-white-primary' },
          style: {
            '&.MuiSwitch-root': {
              width: '78px',
              padding: '4px',

              // Transition
              '& .Mui-checked': {
                transform: 'translateX(40px)',
              },

              '& .Mui-checked+.MuiSwitch-track': {
                background: muiSwitch.trackPrimary,
                opacity: '1',
              },

              '& .MuiSwitch-thumb': {
                background: muiSwitch.thumbOff,
              },

              '& .Mui-checked .MuiSwitch-thumb': {
                background: muiSwitch.thumbPrimary,
              },
            },

            // Thumb Color

            // Track Color
            '& .MuiSwitch-track': {
              background: muiSwitch.trackPrimary,
              borderRadius: '22px',
              opacity: '1',
            },
          },
        },
        {
          props: { variant: 'rb-purple-primary' },
          style: {
            '&.MuiSwitch-root': {
              width: '50px',
              height: '32px',
              padding: '4px',

              '& .PrivateSwitchBase-root': {
                padding: '5px 0',
                top: '50%',
                transform: 'translateY(-50%)',
              },

              '& .Mui-checked': {
                top: '50%',
                transform: 'translate(28px,-50%)',
              },

              '& .Mui-checked+.MuiSwitch-track': {
                background: muiSwitch.trackSecondary,
                opacity: '1',
              },
            },

            // Thumb Color
            '& .MuiSwitch-thumb': {
              background: muiSwitch.thumbOffSecondary,
            },

            '& .Mui-checked .MuiSwitch-thumb': {
              background: muiSwitch.thumbPrimary,
            },

            // Track Color
            '& .MuiSwitch-track': {
              background: muiSwitch.trackSecondary,
              borderRadius: '22px',
              opacity: '1',
            },
          },
        },
      ],
    },
  };
}
