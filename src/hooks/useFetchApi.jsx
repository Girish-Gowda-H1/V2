import { useToastContext } from '@context/ToastContextProvider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function useFetchApi({ key, url = '', fetchOnMount = true, ...queryProps }) {
  const fetchUrl = useRef();

  const { setSnackbar } = useToastContext();

  const { pathname: currentLocation } = useLocation();
  const isLoginPath = currentLocation === '/login' || currentLocation === '/register';

  const redirectAfterLoginPath = `/login?from=operations&redirect_to=${isLoginPath ? '/dashboard' : currentLocation || '/dashboard'}`;

  const fetchData = useCallback(async () => {
    return await axios.get(fetchUrl.current || url).then((res) => {
      if (res.data.message === 'restricted') {
        setSnackbar({
          show: true,
          autohide: true,
          autohideDuration: 3000,
          message: 'Permission Not Allowed!',
          variant: 'error',
          vertical: 'bottom',
        });
        return { data: { status: 405, data: null } };
      }

      if (res.data.status === false) {
        setSnackbar({
          show: true,
          autohide: true,
          autohideDuration: 3000,
          message: 'Please Login Again!',
          variant: 'error',
          vertical: 'bottom',
        });

        if (!isLoginPath) {
          return window.location.replace(redirectAfterLoginPath);
        }
      }

      return res;
    });
  }, [isLoginPath, redirectAfterLoginPath, setSnackbar, url]);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch: func,
  } = useQuery({
    queryKey: key,
    queryFn: fetchUrl.current || url ? fetchData : () => null,
    enabled: fetchOnMount,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: false,
    ...queryProps,
  });

  return {
    isLoading,
    isFetching,
    data,
    func,
    error,
    setUrl: (url) => (fetchUrl.current = url),
  };
}
