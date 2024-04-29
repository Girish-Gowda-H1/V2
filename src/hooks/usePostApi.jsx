import { useCallback, useState } from 'react';
import axios from 'axios';
import { useToastContext } from '@context/ToastContextProvider';

export default function usePostApi({ url, method = 'post' }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const { setSnackbar } = useToastContext();

  const postData = useCallback(
    async ({ url: modifiedUrl, body, headers }) => {
      setIsLoading(true);
      return await axios
        .post(modifiedUrl || url, body, { headers })
        .then((res) => {
          if (res.data) {
            setData(res.data);
          }

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

          return res;
        })
        .catch((err) => {
          return err;
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [setSnackbar, url]
  );

  const putData = useCallback(
    async ({ url: modifiedUrl, body, headers }) => {
      setIsLoading(true);
      return await axios
        .put(modifiedUrl || url, body, { headers })
        .then((res) => {
          if (res.data) {
            setData(res.data);
          }

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

          return res;
        })
        .catch((err) => {
          return err;
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [setSnackbar, url]
  );

  const patchData = useCallback(
    async ({ url: modifiedUrl, body, headers }) => {
      setIsLoading(true);
      return await axios
        .patch(modifiedUrl || url, body, { headers })
        .then((res) => {
          if (res.data) {
            setData(res.data);
          }

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

          return res;
        })
        .catch((err) => {
          return err;
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [url]
  );

  const postFunction = method === 'post' ? postData : method === 'put' ? putData : patchData;

  return { isLoading, data, func: postFunction };
}
