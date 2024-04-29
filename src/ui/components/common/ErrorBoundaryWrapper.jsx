import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Typography } from '@mui/material';
import React from 'react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class ErrorBoundaryWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };

    this.handleClose = this.handleClose.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorInfo: error.stack };
  }

  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo });
  }

  handleClose() {
    this.setState({ hasError: false, errorInfo: null });
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <Dialog
          open={this.state.hasError}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle variant="h2" color="#b3452e">
            Something went wrong!
          </DialogTitle>
          <DialogContent>
            <p style={{ color: '#cc4e34', fontSize: '1rem' }} dangerouslySetInnerHTML={{ __html: this.state.errorInfo?.replace(/\n/g, '<br />') }} />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              sx={{
                background: '#e6583b',
                ':hover': {
                  background: '#e6583b',
                },
                color: '#fff',
              }}
              onClick={() => window.location.reload()}
            >
              <Typography variant="h5">Reload The Page</Typography>
            </Button>
          </DialogActions>
        </Dialog>
      );
    }

    return this.props.children;
  }
}
