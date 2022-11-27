import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useProvideAuth } from '../auth-methods/jwt-auth';
import LoadingScreen from '../../../components/loading';
import { useAuth } from "..";

const AuthPage = ({ children }) => {
  const { loadingAuthUser, authUser, setError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loadingAuthUser && authUser) {
      router.push('/').then((r) => r);
    }

    return () => setError('');
  }, [authUser, loadingAuthUser]);

  return authUser && loadingAuthUser ? <LoadingScreen /> : children;
}
export default AuthPage;
