import dynamic from "next/dynamic";
const LiveRoomCSR = dynamic(() => import("../../components/LiveRoom.js"), { ssr: false });
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LiveRoom() {
  
  const route = useRouter();
  useEffect(() => {
  }, [route]);

  return <>{route.query.roomID ? <LiveRoomCSR roomID={route.query.roomID} created={route.query.created} /> : ""}</>;
}
