import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useProvideAuth } from "../auth-methods/jwt-auth";
import LoadingScreen from "../../../components/Loading";
import { useAuth } from "..";
// eslint-disable-next-line react/prop-types
const SecurePage = ({ children }) => {
  const { loadingAuthUser, authUser, setError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loadingAuthUser && !authUser) {
      router.push("/signin").then((r) => r);
    }

    return () => setError("");
  }, [authUser, loadingAuthUser]);

  return authUser && !loadingAuthUser ?  children  : <LoadingScreen />;
};

export default SecurePage;
