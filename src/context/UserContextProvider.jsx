// UserContextProvider
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

// Axios
import axios from 'axios';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const localToken = localStorage.getItem('u_t');
  const urlToken = searchParams.get('token');
  const redirectPath = searchParams.get('redirect_to');

  const { pathname: currentLocation } = useLocation();
  const isLoginPath = currentLocation === '/login' || currentLocation === '/register';

  const redirectAfterLoginPath = `/login?from=operations&redirect_to=${isLoginPath ? '/dashboard' : currentLocation || '/dashboard'}`;

  const fetchUser = useCallback(
    async (token) => {
      if (token && typeof token === 'string') {
        setLoading(true);
        return await axios
          .get('verify_user', { headers: { 'HASH-TOKEN': token } })
          .then((res) => {
            if (res?.data?.status) {
              setUser(res.data);

              localStorage.setItem('u_t', token);
              localStorage.setItem('u_st', res.data.data.secure_token);
              localStorage.setItem('u_id', res.data.data.user_id);

              // if (redirectPath) {
              //   window.location.replace(redirectPath);
              // } else if (isLoginPath) {
              //   window.location.replace('dashboard');
              // }
            } else {
              setUser(null);
              localStorage.removeItem('u_t');
              localStorage.removeItem('u_id');
              localStorage.removeItem('u_st');

              throw new Error('Cannot Login! Please refresh the page.');
            }
          })
          .catch((err) => {
            console.log({ err });
            setUser(undefined);
            // navigate('login');
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    [isLoginPath, redirectPath]
  );

  useEffect(() => {
    if (!isLoginPath && !loading && !localToken) {
      // window.location.replace(redirectAfterLoginPath);
    } else if (localToken && user === null && !loading) {
      fetchUser(localToken);
    }
  }, [fetchUser, isLoginPath, loading, localToken, navigate, redirectAfterLoginPath, user]);

  const render = useCallback(() => {
    return children;
    // if (user || isLoginPath || urlToken) {
    // } else {
    //   return <Loader />;
    // }
  }, [children, isLoginPath, urlToken, user]);

  const contextValue = useMemo(() => ({ user, loading, fetchUser }), [user, loading, fetchUser]);

  return <UserContext.Provider value={contextValue}>{render()}</UserContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => {
  return useContext(UserContext);
};

export default UserContext;
