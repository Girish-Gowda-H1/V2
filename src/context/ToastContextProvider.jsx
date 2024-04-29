import { createContext, useContext, useMemo, useState } from 'react';
import CustomSnackbar from '@components/common/CustomSnackbar';

const ToastContext = createContext();

const initialValues = {
  show: false,
  message: '',
  autoHide: true,
  autoHideDuration: 3000,
  vertical: '',
  variant: '',
};

export const ToastContextProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState(initialValues);

  const contextValues = useMemo(
    () => ({
      snackbar,
      setSnackbar,
    }),
    [snackbar]
  );

  return (
    <ToastContext.Provider value={contextValues}>
      {children}
      <CustomSnackbar
        open={snackbar.show}
        message={snackbar.message}
        autoHide={snackbar.autoHide}
        autoHideDuration={snackbar.autoHideDuration}
        onClose={() => setSnackbar(initialValues)}
        {...snackbar}
      />
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToastContext = () => {
  return useContext(ToastContext);
};

export default ToastContext;
