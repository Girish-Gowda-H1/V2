// React
import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';

// Axios
import Loader from '@components/common/Loader';

// Local
import useFetchApi from '@hooks/useFetchApi';
import { useLocation, useNavigate } from 'react-router-dom';
import { routesMapping } from '../constants/RoutesMapping';
import { useToastContext } from '@context/ToastContextProvider';

const PermissionsContext = createContext();

export const PermissionsContextProvider = ({ children }) => {
  const { data } = useFetchApi({ key: ['allowed_permissions'], url: 'allowed_permissions' });

  const { setSnackbar } = useToastContext();

  const localToken = localStorage.getItem('u_t');

  const permissionsData = useCallback(() => {
    if (data?.data?.status) {
      return data.data.allowed_permissions;
    }
    return null;
  }, [data]);

  const location = useLocation();
  const navigate = useNavigate();

  const render = useCallback(() => {
    if (!localToken) {
      return children;
    }

    if (permissionsData()) {
      return children;
    } else {
      return <Loader />;
    }
  }, [children, localToken, permissionsData]);

  const isRouteAllowed = useCallback(
    (route) => {
      if (permissionsData()) {
        const currentRoute = location.pathname.slice(1);
        const currentLocation = route || routesMapping[currentRoute];
        const objectKeys = currentLocation?.split('__') || [];
        if (objectKeys.length) {
          return permissionsData()?.[objectKeys[0]]?.[objectKeys[1]];
        } else return true;
      }
    },
    [location.pathname, permissionsData]
  );

  useEffect(() => {
    if (isRouteAllowed() === false) {
      setSnackbar({
        show: true,
        autohide: true,
        autohideDuration: 3000,
        message: 'You are not authorized to view that page!',
        variant: 'error',
        vertical: 'bottom',
      });
      navigate('/');
    }
  }, [isRouteAllowed, navigate, setSnackbar]);

  const contextValue = useMemo(() => ({ permissionsData, isRouteAllowed }), [permissionsData, isRouteAllowed]);

  return <PermissionsContext.Provider value={contextValue}>{render()}</PermissionsContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePermissionsContext = () => {
  return useContext(PermissionsContext);
};

export default PermissionsContext;
