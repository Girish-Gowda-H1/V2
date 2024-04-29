// React
import { useEffect, useState } from 'react';

// External
import { Snackbar, Alert, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const successColor = '#a5d065';
const successBackground = '#f2ffef';
const successIconColor = '#adcf72';
const warningColor = '#307e98';
const warningBackground = '#d2edea';
const warningIconColor = '#307e98';
const errorColor = '#ef4723';
const errorBackground = '#ffbea9';
const errorIconColor = 'ef4723';

export default function CustomSnackbar({
  open: shouldOpen,
  onClose = () => null,
  variant = 'success',
  startEdornment: StartAdornment,
  autoHide = true,
  autoHideDuration = 3000,
  message = 'Success!',
  vertical = 'bottom',
}) {
  const [open, setOpen] = useState(shouldOpen !== undefined ? shouldOpen : true);

  useEffect(() => {
    if (shouldOpen !== undefined) {
      setOpen(shouldOpen);
    }
  }, [shouldOpen]);

  const handleClose = () => {
    setOpen(false);
  };

  const iconColor = () => {
    if (variant === 'success') {
      return successIconColor;
    } else if (variant === 'warning') {
      return warningIconColor;
    } else if (variant === 'error') {
      return errorIconColor;
    }
  };

  const fontColor = () => {
    if (variant === 'success') {
      return successColor;
    } else if (variant === 'warning') {
      return warningColor;
    } else if (variant === 'error') {
      return errorColor;
    }
  };

  const backgroundColor = () => {
    if (variant === 'success') {
      return successBackground;
    } else if (variant === 'warning') {
      return warningBackground;
    } else if (variant === 'error') {
      return errorBackground;
    }
  };

  return open ? (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: vertical || 'bottom', horizontal: 'center' }}
      autoHideDuration={autoHide ? autoHideDuration : undefined}
      onClose={() => {
        handleClose();
        onClose();
      }}
      sx={{
        '& .MuiPaper-root': {
          padding: '6px',
          paddingRight: '24px',
        },
      }}
    >
      <Alert
        icon={StartAdornment || null}
        onClose={handleClose}
        severity={variant || undefined}
        action={<CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />}
        sx={{
          width: 400,
          borderRadius: '30px',
          display: 'flex',
          alignItems: 'center',
          background: backgroundColor(),
          color: fontColor(),
          '& .MuiAlert-message': {
            p: 0,
          },
          '& .MuiAlert-icon': {
            background: '#fff',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& .MuiSvgIcon-root': {
              color: iconColor(),
            },
          },
          '& .MuiAlert-action svg': {
            color: '#222222',
          },
        }}
      >
        <Typography variant="h1" fontFamily="MulishExtraBold" fontSize="16px" letterSpacing="0.8px" textTransform="capitalize">
          {variant}
        </Typography>
        <Typography fontFamily="MulishLight" fontSize="12px" letterSpacing="0.6px" color="#222222">
          {message}
        </Typography>
      </Alert>
    </Snackbar>
  ) : null;
}
