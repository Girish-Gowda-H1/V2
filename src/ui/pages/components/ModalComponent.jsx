import { Fragment, useState } from 'react';
import { Box, Modal } from '@mui/material';

const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: 'none',
  ':focus-visible': {
    outline: 'none',
  },
};

export default function ModalComponent() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Fragment>
      <h1>Image Modal</h1>
      <Box
        sx={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1615807713086-bfc4975801d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1854&q=80)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          width: 150,
          height: 150,
        }}
        onClick={handleOpen}
      />
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={modalStyles}>
          <Box
            sx={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1615807713086-bfc4975801d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1854&q=80)',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              minWidth: 600,
              minHeight: 600,
            }}
          />
        </Box>
      </Modal>
    </Fragment>
  );
}
