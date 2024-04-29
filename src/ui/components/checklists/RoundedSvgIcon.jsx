import { IconButton, useTheme } from '@mui/material';

export default function RoundedSvgIcon({ icon: Icon, isActive = true, sx, onClick = () => null, ...inputProps }) {
  const theme = useTheme();

  return (
    <IconButton
      aria-label="Example"
      onClick={onClick}
      disableRipple
      sx={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: '1px solid',
        borderColor: theme.palette.grey[300],
        boxShadow: '0px 0px 6px ' + theme.palette.shadowPrimary,
        background: isActive ? theme.palette.button.yellowPrimary : '',
        '&:hover': {
          background: isActive ? theme.palette.button.yellowPrimary : '',
        },
        ...sx,
      }}
      {...inputProps}
    >
      <Icon color="black" width={21} />
    </IconButton>
  );
}
