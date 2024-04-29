import { Card, CardContent, useTheme } from '@mui/material';

export default function CustomCard({ children, sx, cardContentProps, ...cardProps }) {
  const theme = useTheme();

  const basicStyles = {
    px: 5,
    minWidth: 275,
    borderRadius: '10px',
    boxShadow: '0px 0px 10px ' + theme.palette.card.shadowSecondary,
    my: 2,
  };

  return (
    <Card sx={{ ...basicStyles, ...sx }} {...cardProps}>
      <CardContent {...cardContentProps}>{children}</CardContent>
    </Card>
  );
}
