import React, { createContext, useContext } from 'react';
import { useProvideAuth } from './auth-methods/jwt-auth';
import { useSelector, useDispatch } from "react-redux";

const authContext = createContext();
// Provider component that wraps your app and makes auth object ..
// ... available to any child component that calls useAuth().

export function AuthProvider({ children }, {store}) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth} store={store}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.

export const useAuth = () => {
  return useContext(authContext);
};

export const loggedIn = () =>{
  const result = useSelector((res) => res.user.loggedIn);
  return result;
} 

