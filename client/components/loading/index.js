import Image from "next/image";
import Head from "next/head";
import MeowmeowLogo from "../../public/asset/logo.png"
import ReactLoading from "react-loading";

export default function LoadingMinimal ({message}) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="flex flex-col items-center justify-center h-12">
        <ReactLoading type="spin" color="#000" width={40}/>
      </div>
      <p className="text-center">{message}</p>
    </div>
  );
};

export const LoadingScreen = ({message}) => {
  return (
    <div className="absolute z-40 bg-white w-full">
      <Head>
        <title>Loading...</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <div className="flex flex-col items-center justify-center">
          <Image src={MeowmeowLogo} className="w-36" alt="logo_loading"/>
          <ReactLoading type="bubbles" color="#000" width={40} height={40}/>
          <p className="text-center font-semibold text-primary text-lg">{message}</p>
        </div>
      </div>
    </div>
  );
};
