import React, { useState } from "react";
import { IntlProvider } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import { messages } from "../react-intl/messages";
import { AuthProvider, loggedIn } from "../auth";
import ErrorBoundary from "../../components/error/ErrorBoundary";
import toast, { Toaster } from 'react-hot-toast';

export default function Wrapper({ children, store }) {
  const clientConfig = useSelector((state) => state);
  return (
    <IntlProvider
      locale={clientConfig.config.language}
      messages={messages[clientConfig.config.language]}
    >
      <Toaster
        position="bottom-center"
        reverseOrder={true}
        toastOptions={{
          duration: 5000,
          className: "m-toast",
          success: {
            style: {
              background: "#23d959",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#ff2e2e",
              color: "#fff",
            },
          },
        }}
      />
      <ErrorBoundary>
        <AuthProvider store={clientConfig}>{children}</AuthProvider>
      </ErrorBoundary>
    </IntlProvider>
  );
}
