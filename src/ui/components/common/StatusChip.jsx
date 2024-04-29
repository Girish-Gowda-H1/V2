import { Chip, Typography } from '@mui/material';

export default function StatusChip({ label, labelColor, variant = 'outlined', color, sx, ...inputProps }) {
  return (
    <Chip
      label={
        <Typography variant="h4" fontSize="12px" color={labelColor}>
          {label}
        </Typography>
      }
      variant={variant}
      sx={{ width: 100, background: `${color} !important`, border: `1px solid ${labelColor} !important`, ...sx }}
      {...inputProps}
    />
  );
}
