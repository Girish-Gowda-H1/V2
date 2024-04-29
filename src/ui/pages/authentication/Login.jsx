// Login Page
import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// Local
import { useUserContext } from '@context/UserContextProvider';

// ================================|| LOGIN ||================================ //

const Login = () => {
  const { user, fetchUser, loading: userLoading } = useUserContext();

  const [searchParams] = useSearchParams();

  const userToken = searchParams.get('token');
  const redirectPath = searchParams.get('redirect_to') || 'dashboard';

  const initiateLogin = useCallback(() => {
    const ssoUrl = (import.meta.env.RB_SSO_AUTH_URL || 'https://www.royalbrothers.club/admin/login') + `?from=operations&redirect_to=${redirectPath}`;

    // window.location.replace(ssoUrl);
  }, [redirectPath]);

  useEffect(() => {
    if (user === null && !userLoading) {
      if (userToken) {
        fetchUser(userToken);
      } else {
        initiateLogin();
      }
    } else if (!userLoading && !userToken) {
      initiateLogin();
    }
  }, [fetchUser, userToken, userLoading, user, initiateLogin]);

  return null;
};

export default Login;
