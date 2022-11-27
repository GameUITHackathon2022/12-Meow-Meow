import "../styles/globals.css";
import Wrapper from "../service/wrapper";
import { LoadingScreen, LoadingMinimal } from "../components/loading";
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { store } from "../service/redux/reducers";
import { useAutoAnimate } from "@formkit/auto-animate/react";

let persistor = persistStore(store)

function MyApp({ Component, pageProps }) {
  const [myApp] = useAutoAnimate({ duration: 150, easing: "linear" });
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen/>} persistor={persistor}>
        <Wrapper>
          <div className="font-montserrat w-screen h-screen overflow-x-hidden overflow-y-visible" ref={myApp}>
            <Component {...pageProps} />
          </div>
        </Wrapper>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
