import React from 'react'
import { useEffect, useState } from 'react'
import { Axios } from '../../../axios/config'
import toast from 'react-hot-toast'
import { useSelector, useDispatch } from "react-redux"
import { setLoggedIn, setLogOut } from "../../../redux/slices/user"
import IntlMessages from '../../../react-intl/IntlMessages'

export const useProvideAuth = () => {
  const dispatch = useDispatch();
  const [authUser, setAuthUser] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loadingAuthUser, setLoadingAuthUser] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const fetchStart = () => {
    setLoading(true);
    setError('');
  };

  const fetchSuccess = () => {
    setLoading(false);
    setError('');
  };

  const fetchError = (error) => {
    setLoading(false);
    setError(error);
  };

  const fetchNoti = (txt) => {
    setLoading(false);
    setMessage(txt);
  };

  const bypassLogin = (user, callbackFun) => {
    setAuthUser(true);
  }

  const userLogin = (user, callbackFun) => {
    fetchStart();
    // console.log(user)
    Axios
      .post('/auth/sign-in/', user)
      .then(({ data }) => {
        if (data.statusCode == "200") {
          toast.success(<IntlMessages id="noti.signin.success"/>)
          dispatch(setLoggedIn())
          setTimeout(() => {
            setAuthUser(true)
            setLoadingAuthUser(false)
          }, 500)
          getInfo()
        }
        else {
          toast.error(<IntlMessages id="noti.signin.failed"/> );
        }
      })
      .catch(function (error) {
        toast.error(<IntlMessages id="noti.signin.failed"/> );
      })
  }

  const userSignup = (user) => {
    fetchStart();
    Axios
      .post('/auth/sign-up/', user)
      .then(({ data }) => {
        fetchSuccess();
        if (data.statusCode == "200") {
          toast.success(<IntlMessages id="noti.signup.success"/>);
          const data = {
            email: user.email,
            password: user.password,
          }
          userLogin(data)
        }
        else {
          toast.error(<IntlMessages id="noti.signup.failed"/> );
        }
      })
      .catch(function (error) {
        toast.error(<IntlMessages id="noti.signup.failed"/>);
      })
  };


  const sendPasswordResetEmail = (email, callbackFun) => {
    fetchStart();

    setTimeout(() => {
      fetchSuccess();
      //if (callbackFun) callbackFun();
    }, 300);
  };

  const confirmPasswordReset = (code, password, callbackFun) => {
    fetchStart();

    setTimeout(() => {
      fetchSuccess();
      //if (callbackFun) callbackFun();
    }, 300);
  };

  const renderSocialMediaLogin = () => null;

  const userSignOut = () => {
    Axios
      .get('/auth/sign-out/')
      .then(() => {
        dispatch(setLogOut())
        setAuthUser(false)
        toast.success(<IntlMessages id="noti.signout.success"/>)
      })
      .catch(function (error) {
        toast.error(<IntlMessages id="noti.signout.error"/>)
      });
  };

  const getInfo = () => {
    Axios
      .get('/user/get-info')
      .then(({ data }) => {
        if (data.statusCode == "200") {
          dispatch(setLoggedIn(data.info))
          setAuthUser(true)
          setLoadingAuthUser(false)
        }
        else {
          dispatch(setLogOut())
          setAuthUser(false)
          setLoadingAuthUser(true)
        }
      })
      .catch(function (error) {
        dispatch(setLogOut())
        setAuthUser(false)
        setLoadingAuthUser(true)
        // toast.error(error.message)
      });
  };


  const changeInfo = (user, callbackFun) => {
   
  };

  const getAuthUser = () => {
    
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.

  useEffect(() => {
    getInfo();
  }, []);

  // Return the user object and auth methods
  return {
    loadingAuthUser,
    isLoading,
    authUser,
    error,
    bypassLogin,
    setError,
    message,
    setMessage,
    setAuthUser,
    getAuthUser,
    userLogin,
    userSignup,
    userSignOut,
    getInfo,
    changeInfo,
    renderSocialMediaLogin,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
};
