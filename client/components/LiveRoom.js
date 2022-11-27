import { useEffect, useState, useRef, useCallback } from "react";
import Peer from "peerjs";
import { io } from "socket.io-client";
import Loading from "./loading/index";
import ChatBreak from "./chat/ChatBreak";
import RemoteChat from "./chat/RemoteChat";
import MeChat from "./chat/MeChat";
import ChatFooter from "./chat/ChatFooter";
import HostLeft from "./HostLeft";
import { useRouter } from 'next/router'

const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}/room`);
var created;

export default function LiveRoom({ roomID }) {
  const router = useRouter()
  const isOwner = router.query.owner === "true";
  const avatarImg = router.query.avatarImg;
  const [shareAudio, setShareAudio] = useState(true);
  const [shareCam, setShareCam] = useState(true);
  const [sharingScreen, setSharingScreen] = useState(false);

  const [myCallScreenOff, setMyCallScreenOff] = useState(true);
  const [remoteCallScreenOff, setRemoteCallScreenOff] = useState(null);
  const [remoteShareAudio, setRemoteShareAudio] = useState(true);

  const [alerts, setAlerts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const [myName, setMyName] = useState("");
  const [mySocketID, setMySocketID] = useState("");
  const [remoteSocketID, setRemoteSocketID] = useState("");

  const [missingPermissions, setMissingPermissions] = useState([]);

  const [classChatBox, setClassChatBox] = useState("w-0 hidden");
  const [classChatToogle, setClassChatToogle] = useState("left-0");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const myCallTrack = useRef();
  const myCallStream = useRef();
  const myWebcamStream = useRef();
  const myScreenStream = useRef();
  const myPeer = useRef();
  const myMediaConnection = useRef();
  const myVideo = useRef();
  const remoteVideo = useRef();
  const alertsRef = useRef([]);
  const mainVideo = useRef();

  useEffect(() => {
    // setLoading(true);
    socket.on("me", (socketID) => {
      setMySocketID(socketID);
      if (isOwner) {
        handleCreateRoom();
      } else {
        handleJoinRoom();
      }
    });
  }, []);

  useEffect(() => {
    socket.on("remote turned webcam off", () => {
      setRemoteCallScreenOff(true);
      handleRemoteCallScreen(null);
    });

    socket.on("remote turned webcam on", () => {
      setRemoteCallScreenOff(false);
    });

    socket.on("remote started sharing screen", () => {
      setRemoteCallScreenOff(false);
      handleAddChatBreak("Remote started sharing screen");
    });

    socket.on("remote stoped sharing screen", () => {
      setRemoteCallScreenOff(true);
      handleRemoteCallScreen(null);
      handleAddChatBreak("Remote stoped sharing screen");
    });

    socket.on("remote started sharing audio", () => {
      console.log("remote started sharing audio");
      setRemoteShareAudio(true);
    });

    socket.on("remote stoped sharing audio", () => {
      console.log("remote stoped share audio");
      setRemoteShareAudio(false);
    });
  }, [messages]);

  useEffect(() => {
    if (classChatBox == "show-chat-box" && unreadMessages > 0) {
      setUnreadMessages(0);
    }
  }, [classChatBox]);

  useEffect(() => {
    if (!created) {
      socket.on("remote join room", (id) => {
        setRemoteSocketID(id);
        handleAddAlert("New attendance !", id + " has joined your room");
      });

      socket.on("remote leave call", () => {
        myMediaConnection.current?.close();
        myMediaConnection.current = null;
        setRemoteCallScreenOff(null);
        handleAddAlert("Attendance left !", remoteSocketID + " has left your room");
        setRemoteSocketID(null);
      });
    }

    socket.on("remote chatted", (message) => {
      handleAddChatFromRemote(message);
      handleRemoteNewMessage();
    });

    socket.on("remote sent code", (message) => {
      handleAddCodeFromRemote(message);
      handleRemoteNewMessage();
    });

    socket.on("new chat break", (content) => {
      handleAddChatBreak(content);
    });
    // return () => socket.disconnect();
  }, [alerts, messages, remoteSocketID, unreadMessages, classChatBox, socket]);

  const handleRemoteNewMessage = useCallback(() => {
    // console.log(messages);
    if (classChatBox == "hide-chat-box" || classChatBox == "w-0 hidden") {
      setUnreadMessages(unreadMessages + 1);
    }
  }, [unreadMessages, classChatBox]);

  const handleAddCodeFromMe = useCallback(
    (content) => {
      setMessages([...messages, { isOwner: isOwner, from: "me", socketID: socketID, content: content, type: "output code" }]);
      socket.emit("me send code", { content: content, socketID: socketID, roomID: roomID });
    },
    [messages]
  );

  const handleAddCodeFromRemote = useCallback(
    (content) => {
      setMessages([...messages, { isOwner: isOwner, from: "remote", socketID: socketID, content: content, type: "output code" }]);
    },
    [messages]
  );

  const handleAddChatBreak = useCallback(
    (content) => {
      setMessages([...messages, { content: content, type: "chat break" }]);
    },
    [messages]
  );

  const handleAddChatFromMe = useCallback(
    (msg) => {
      setMessages([...messages, { isOwner: isOwner, from: "me", socketID: mySocketID, content: msg.content, type: "chat" }]);
      socket.emit("me chat", { isOwner: isOwner, content: msg.content, socketID: mySocketID, roomID: roomID });
    },
    [messages]
  );

  const handleAddChatFromRemote = useCallback(
    (message) => {
      setMessages([...messages, { isOwner: message.isOwner, from: "remote", socketID: message.socketID, content: message.content, type: "chat" }]);
    },
    [messages]
  );

  const handleAddAlert = useCallback(
    (title, content) => {
      setAlerts([...alerts, { title: title, content: content }]);
    },
    [alerts]
  );

  const handleDeleteAlert = useCallback(
    (index) => {
      const _alerts = [...alerts];
      _alerts.splice(index, 1);
      alertsRef.current = [..._alerts]; //Không biết tại sao dùng alersRef thì lại ko dc @_@
      console.log(alertsRef.current);
      setAlerts(_alerts);
    },
    [alerts]
  );

  const handleMainCallStream = (stream) => {
    mainVideo.current.srcObject = stream;
    mainVideo.current.muted = true;
    mainVideo.current.play();
    myCallStream.current = stream;
  };

  const handleRemoteCallScreen = (stream) => {
  };

  const handleEndCall = () => {
    setLoading(true);
    // remoteVideo.current.muted = true;
    window.location.href = window.location.origin + "/live";
  };

  const handleStartShareScreen = () => {
    navigator.mediaDevices
      .getDisplayMedia({ video: { mediaSource: "screen" }, audio: true })
      .then(async (stream) => {
        myWebcamStream.current?.getTracks().forEach((track) => track.stop());
        myCallTrack.current?.stop();
        myCallTrack.current = stream.getTracks().filter((track) => track.kind == "video")[0];
        socket.emit("start sharing screen", roomID);
        let finalStream = null;
        //audio của người dùng
        if (shareAudio) {
          const audio = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

          finalStream = new MediaStream([...stream.getTracks(), ...audio.getTracks()]);

          //Luu screen stream de ti hoi ngat ket noi
          myWebcamStream.current = audio;
          myScreenStream.current = finalStream;
        } else {
          finalStream = stream;
          myScreenStream.current = finalStream;
        }

        setMyCallScreenOff(false);
        handleMainCallStream(finalStream);
        myCallStream.current = finalStream;
        setSharingScreen(true);

        //Neu ma chua call
        if (!myMediaConnection.current && !remoteSocketID) {
          console.log("!myMediaConnection.current && !remoteSocketID");
          return;
        }

        //Neu da call roi
        if (created) myPeer.current.call(roomID, finalStream);
        else myPeer.current.call("joiner-" + roomID, finalStream);
      });
  };

  const handleStopShareScreen = () => {
    socket.emit("stop sharing screen", roomID);
    myScreenStream.current?.getTracks().forEach((track) => track.stop());
    myCallTrack.current?.stop();
    if (shareAudio == false && shareCam == false) {
      setSharingScreen(false);
      setMyCallScreenOff(true);
      return;
    }
    navigator.getUserMedia({ video: shareCam, audio: shareAudio }, (stream) => {
      handleMainCallStream(stream);
      myCallStream.current = stream;
      myWebcamStream.current = stream;

      if (!shareCam) setMyCallScreenOff(true);

      if (!myMediaConnection.current && !remoteSocketID) {
        console.log("!myMediaConnection.current && !remoteSocketID");
        setSharingScreen(false);
        return;
      }

      if (created) myPeer.current.call(roomID, stream);
      else myPeer.current.call("joiner-" + roomID, stream);
      setSharingScreen(false);
    });
  };

  const handleUnShareAudio = () => {
    //Trường hợp đang share screen mà đòi tắt audio thì
    if (sharingScreen) {
      myWebcamStream.current?.getTracks().forEach((track) => {
        if (track.kind != "video") track.stop();
      });
      socket.emit("stop sharing audio", roomID);
      setShareAudio(false);
      return;
    }

    myWebcamStream.current?.getTracks().forEach((track) => {
      if (track != myCallTrack.current) track.stop();
    });
    //Trường hợp tắt audio mà cam cũng đang tắt thì:
    if (shareCam == false && !shareAudio == false) {
      myCallStream.current = null;
      myWebcamStream.current?.getTracks().forEach((track) => track.stop());
      //nếu chưa có ai vào
      if (!myMediaConnection.current && !remoteSocketID) {
        setShareAudio(false);
        return;
      }

      if (created) myPeer.current.call(roomID, null);
      else myPeer.current.call("joiner-" + roomID, null);
      socket.emit("stop sharing audio", roomID);
      setShareAudio(false);
      return;
    }
    navigator.getUserMedia({ video: shareCam, audio: !shareAudio }, (stream) => {
      myCallStream.current = stream;
      stream.getTracks().forEach((track) => myWebcamStream.current?.addTrack(track));
      //nếu chưa có ai vào
      if (!myMediaConnection.current && !remoteSocketID) {
        setShareAudio(false);
        return;
      }

      if (created) myPeer.current.call(roomID, stream);
      if (!created) myPeer.current.call("joiner-" + roomID, stream);
      socket.emit("stop sharing audio", roomID);
      setShareAudio(false);
    });
  };

  const handleShareAudio = async () => {
    if (sharingScreen) {
      if (!myCallTrack.current) return;
      const audio = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      audio.addTrack(myCallTrack.current);

      //Lưu tạm audio vào webcam stream tí hồi clear
      myWebcamStream.current = audio;
      myCallStream.current = audio;

      //nếu chưa có ai vào
      if (!myMediaConnection.current && !remoteSocketID) {
        setShareAudio(true);
        return;
      }

      if (created) myPeer.current.call(roomID, audio);
      if (!created) myPeer.current.call("joiner-" + roomID, audio);
      socket.emit("start sharing audio", roomID);
      setShareAudio(true);
      return;
    }
    navigator.getUserMedia(
      { video: shareCam, audio: !shareAudio },
      (stream) => {
        myCallStream.current = stream;

        myWebcamStream.current?.getTracks().forEach((track) => {
          if (track != myCallTrack.current) track.stop();
        });
        stream.getTracks().forEach((track) => myWebcamStream.current?.addTrack(track));
        //nếu chưa có ai vào
        if (!myMediaConnection.current && !remoteSocketID) {
          setShareAudio(true);
          return;
        }

        if (created) myPeer.current.call(roomID, stream);
        if (!created) myPeer.current.call("joiner-" + roomID, stream);
        // if (created && myCallTrack.current?.enabled) myPeer.current.call(roomID, new MediaStream(myCallTrack.current));
        // if (!created && myCallTrack.current?.enabled) myPeer.current.call("joiner-" + roomID, new MediaStream(myCallTrack.current));
        socket.emit("start sharing audio", roomID);
        setShareAudio(true);
      },
      (err) => {
        socket.emit("stop sharing audio", roomID);
        setShareAudio(false);
      }
    );
    // myVideo.current.muted = false;
  };

  const handleStartWebcam = () => {
    // if (!myMediaConnection.current && !remoteSocketID) return;
    if (sharingScreen) return;
    myWebcamStream.current?.getTracks().forEach((track) => track.stop());
    navigator.getUserMedia(
      { video: { width: 1280, height: 720 }, audio: shareAudio },
      (stream) => {
        handleMainCallStream(stream);
        myCallStream.current = stream;
        myWebcamStream.current = stream;
        myCallTrack.current = stream.getTracks().filter((track) => track.kind == "video")[0];
        setShareCam(true);
        setMyCallScreenOff(false);

        // Nếu chưa có ai vào
        if (!myMediaConnection.current && !remoteSocketID && !remoteSocketID) {
          console.log("Lọt vào đây");
          return;
        }

        //Nếu là người tạo phòng và đã có người vào thì đưa stream mới có video cho người đó
        if (created) myPeer.current.call(roomID, stream);
        else myPeer.current.call("joiner-" + roomID, stream);

        socket.emit("turn webcam on", roomID);
      },
      (err) => {
        setShareCam(false);
      }
    );
  };

  const handleStopWebcam = () => {
    socket.emit("turn webcam off", roomID);
    myWebcamStream.current?.getTracks().forEach((track) => track.stop());
    myCallTrack.current?.stop();
    if (!shareCam == false && shareAudio == false) {
      //Trường hợp yêu cầu tắt cam nhưng audio cũng đang tắt thì:
      handleMainCallStream(null);

      //Nếu chưa có ai vào
      if (!myMediaConnection.current && !remoteSocketID) {
        setShareCam(false);
        setMyCallScreenOff(true);
        return;
      }

      if (created) myPeer.current.call(roomID, null);
      else myPeer.current.call("joiner-" + roomID, null);
      setShareCam(false);
      setMyCallScreenOff(true);
      return;
    }

    navigator.getUserMedia({ video: !shareCam, audio: shareAudio }, (stream) => {
      handleMainCallStream(stream);
      myWebcamStream.current = stream;

      //Nếu chưa có ai vào
      if (myMediaConnection.current == undefined) {
        setShareCam(false);
        setMyCallScreenOff(true);
        return;
      }

      if (created) myPeer.current.call(roomID, stream);
      else myPeer.current.call("joiner-" + roomID, stream);
      setShareCam(false);
      setMyCallScreenOff(true);
    });
    // myWebcamStream.current?.getTracks()[0].enabled = false;
  };

  const handleCreateRoom = () => {
    var peer = new Peer(roomID);
    myPeer.current = peer;

    peer.on("open", (id) => {
      // handleAddChatBreak("You have joined room");
      navigator.getUserMedia(
        { video: true, audio: true },
        (stream) => {
          // console.log("stream", stream);
          handleMainCallStream(stream);
          myWebcamStream.current = stream;
          peer.on("disconnected", () => {
            console.log("remote disconnected");
          });

          peer.on("close", () => {
            console.log("remote close");
          });

          peer.on("call", (call) => {
            call.answer(myCallStream.current);
          });

          socket.emit("create room", roomID);
        },
        (err) => {
          //////////////////////////fix tam thoi//////////////////////////
          window.location.href = window.location.origin + '/ub-error';
          return;
          ////////////////////////////////////////////////////////////////
          setShareAudio(false);
          handleMainCallStream(null);
          peer.on("disconnected", () => {
            console.log("remote disconnected");
          });

          peer.on("close", () => {
            console.log("remote close");
          });

          peer.on("call", (call) => {
            call.answer(myCallStream.current);
            call.on("stream", (stream) => {
              handleRemoteCallScreen(stream);
              call.on("close", () => {
                console.log("close call");
              });
            });
            myMediaConnection.current = call;
            //Send the remote my current video state
          });

          socket.emit("create room", roomID);
        }
      );
    });
  };

  const handleJoinRoom = (socketID) => {
    myPeer.current = new Peer(`joiner-${socketID}-${roomID}`); //tạo ID người vào là joiner-[roomID]
    socket.emit("join room", roomID);

    myPeer.current.on("open", (id) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      getUserMedia({ video: true, audio: true }, function (stream) {
        var call = myPeer.current.call(roomID, stream);
        call.on('stream', function (remoteStream) {
          handleMainCallStream(remoteStream);
        });
      }, function (err) {
        console.log('Failed to get local stream', err);
      });
    });

    // người join room nhận dc sự thay đổi từ người tạo room
    // myPeer.current.on("call", (call) => {
    //   call.answer(myCallStream.current);
    //   call.on("stream", (stream) => {
    //     console.log(stream.getTracks());
    //     handleRemoteCallScreen(stream);
    //     if (stream.getTracks()[stream.getTracks().length - 1].kind == "video") {
    //       setRemoteCallScreenOff(false);
    //       if (stream.getTracks().length != 1) {
    //         stream.getTracks().forEach((track) => {
    //           if (track.kind == "audio" && track.enabled) {
    //             setRemoteShareAudio(true);
    //             return;
    //           }
    //         });
    //       }
    //     } else {
    //       setRemoteCallScreenOff(true);
    //       setRemoteShareAudio(true);
    //     }
    //   });

    //   call.on("close", () => {
    //     console.log("close call");
    //   });

    //   myMediaConnection.current = call;
    // });
  };

  const handleClassChatBox = () => {
    const _classChatBox = classChatBox == "show-chat-box" ? "hide-chat-box" : "show-chat-box";
    const _classChatToogle =
      classChatToogle == "move-out-chat-toogle-button"
        ? "move-in-chat-toogle-button"
        : "move-out-chat-toogle-button";
    setClassChatBox(_classChatBox);
    setClassChatToogle(_classChatToogle);
  };

  const MuteButton = () => {
    return (
      <div
        onClick={handleUnShareAudio}
        className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-green-500 hover:bg-green-600 hover:cursor-pointer mx-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 fill-white"
          viewBox="0 0 384 512"
        >
          <path d="M192 352c53.03 0 96-42.97 96-96v-160c0-53.03-42.97-96-96-96s-96 42.97-96 96v160C96 309 138.1 352 192 352zM344 192C330.7 192 320 202.7 320 215.1V256c0 73.33-61.97 132.4-136.3 127.7c-66.08-4.169-119.7-66.59-119.7-132.8L64 215.1C64 202.7 53.25 192 40 192S16 202.7 16 215.1v32.15c0 89.66 63.97 169.6 152 181.7V464H128c-18.19 0-32.84 15.18-31.96 33.57C96.43 505.8 103.8 512 112 512h160c8.222 0 15.57-6.216 15.96-14.43C288.8 479.2 274.2 464 256 464h-40v-33.77C301.7 418.5 368 344.9 368 256V215.1C368 202.7 357.3 192 344 192z" />
        </svg>
      </div>
    );
  };

  const UnmuteButton = () => {
    return (
      <div
        onClick={handleShareAudio}
        className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-green-500 hover:bg-green-600 hover:cursor-pointer mx-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 fill-white"
          viewBox="0 0 640 512"
        >
          <path d="M383.1 464l-39.1-.0001v-33.77c20.6-2.824 39.98-9.402 57.69-18.72l-43.26-33.91c-14.66 4.65-30.28 7.179-46.68 6.144C245.7 379.6 191.1 317.1 191.1 250.9V247.2L143.1 209.5l.0001 38.61c0 89.65 63.97 169.6 151.1 181.7v34.15l-40 .0001c-17.67 0-31.1 14.33-31.1 31.1C223.1 504.8 231.2 512 239.1 512h159.1c8.838 0 15.1-7.164 15.1-15.1C415.1 478.3 401.7 464 383.1 464zM630.8 469.1l-159.3-124.9c15.37-25.94 24.53-55.91 24.53-88.21V216c0-13.25-10.75-24-23.1-24c-13.25 0-24 10.75-24 24l-.0001 39.1c0 21.12-5.559 40.77-14.77 58.24l-25.72-20.16c5.234-11.68 8.493-24.42 8.493-38.08l-.001-155.1c0-52.57-40.52-98.41-93.07-99.97c-54.37-1.617-98.93 41.95-98.93 95.95l0 54.25L38.81 5.111C34.41 1.673 29.19 0 24.03 0C16.91 0 9.839 3.158 5.12 9.189c-8.187 10.44-6.37 25.53 4.068 33.7l591.1 463.1c10.5 8.203 25.57 6.328 33.69-4.078C643.1 492.4 641.2 477.3 630.8 469.1z" />
        </svg>
      </div>
    );
  };

  const StopShareWebcamButton = () => {
    if (sharingScreen) return <StartShareWebcamButton />;
    return (
      <div
        onClick={handleStopWebcam}
        className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-cyan-500 hover:bg-cyan-600 hover:cursor-pointer mx-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
          className="w-8 h-8 fill-white"
        >
          <path d="M384 112v288c0 26.51-21.49 48-48 48h-288c-26.51 0-48-21.49-48-48v-288c0-26.51 21.49-48 48-48h288C362.5 64 384 85.49 384 112zM576 127.5v256.9c0 25.5-29.17 40.39-50.39 25.79L416 334.7V177.3l109.6-75.56C546.9 87.13 576 102.1 576 127.5z" />
        </svg>
      </div>
    );
  };

  const StartShareWebcamButton = () => {
    return (
      <div
        onClick={handleStartWebcam}
        className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-cyan-500 hover:bg-cyan-600 hover:cursor-pointer mx-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          className="w-8 h-8 fill-white"
        >
          <path d="M32 399.1c0 26.51 21.49 47.1 47.1 47.1h287.1c19.57 0 36.34-11.75 43.81-28.56L32 121.8L32 399.1zM630.8 469.1l-89.21-69.92l15.99 11.02c21.22 14.59 50.41-.2971 50.41-25.8V127.5c0-25.41-29.07-40.37-50.39-25.76l-109.6 75.56l.0001 148.5l-32-25.08l.0001-188.7c0-26.51-21.49-47.1-47.1-47.1H113.9L38.81 5.111C34.41 1.673 29.19 0 24.03 0C16.91 0 9.84 3.158 5.121 9.189C-3.066 19.63-1.249 34.72 9.189 42.89l591.1 463.1c10.5 8.203 25.57 6.328 33.69-4.078C643.1 492.4 641.2 477.3 630.8 469.1z" />
        </svg>
      </div>
    );
  };

  const StartShareScreenButton = () => {
    return (
      <div className="text-center">
        <div
          onClick={handleStartShareScreen}
          className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-green-600 hover:bg-green-700 hover:cursor-pointer mx-4"
        >
          <svg
            className="w-8 h-8 fill-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          >
            <path d="M528 0h-480C21.5 0 0 21.5 0 48v320C0 394.5 21.5 416 48 416h192L224 464H152C138.8 464 128 474.8 128 488S138.8 512 152 512h272c13.25 0 24-10.75 24-24s-10.75-24-24-24H352L336 416h192c26.5 0 48-21.5 48-48v-320C576 21.5 554.5 0 528 0zM512 352H64V64h448V352z" />
          </svg>
        </div>
      </div>
    );
  };

  const StopShareScreenButton = () => {
    return (
      <div className="text-center">
        <button
          onClick={handleStopShareScreen}
          className="animate-pulse w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-green-600 hover:bg-green-700 hover:cursor-pointer mx-4"
        >
          <svg
            className="w-8 h-8 fill-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          >
            <path d="M528 0h-480C21.5 0 0 21.5 0 48v320C0 394.5 21.5 416 48 416h192L224 464H152C138.8 464 128 474.8 128 488S138.8 512 152 512h272c13.25 0 24-10.75 24-24s-10.75-24-24-24H352L336 416h192c26.5 0 48-21.5 48-48v-320C576 21.5 554.5 0 528 0zM512 352H64V64h448V352z" />
          </svg>
        </button>
      </div>
    );
  };

  const MyCallScreenState = () => {
    if (myCallScreenOff == true)
      return (
        <div className="hidden md:flex z-10 fixed md:absolute bottom-[20vh] left-0 md:top-0 md:left-0 w-[320px] h-[180px] bg-black object-cover border-2 border-green-200 text-white flex justify-center items-center text-2xl">
          Your camera is off
          <div className="fixed md:absolute bottom-[20vh] left-0 md:top-0 md:left-0 h-6 w-6 m-1 flex justify-center items-center rounded-full bg-black opacity-50">
            {shareAudio ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 fill-white"
                viewBox="0 0 384 512"
              >
                <path d="M192 352c53.03 0 96-42.97 96-96v-160c0-53.03-42.97-96-96-96s-96 42.97-96 96v160C96 309 138.1 352 192 352zM344 192C330.7 192 320 202.7 320 215.1V256c0 73.33-61.97 132.4-136.3 127.7c-66.08-4.169-119.7-66.59-119.7-132.8L64 215.1C64 202.7 53.25 192 40 192S16 202.7 16 215.1v32.15c0 89.66 63.97 169.6 152 181.7V464H128c-18.19 0-32.84 15.18-31.96 33.57C96.43 505.8 103.8 512 112 512h160c8.222 0 15.57-6.216 15.96-14.43C288.8 479.2 274.2 464 256 464h-40v-33.77C301.7 418.5 368 344.9 368 256V215.1C368 202.7 357.3 192 344 192z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 fill-red-400"
                viewBox="0 0 640 512"
              >
                <path d="M383.1 464l-39.1-.0001v-33.77c20.6-2.824 39.98-9.402 57.69-18.72l-43.26-33.91c-14.66 4.65-30.28 7.179-46.68 6.144C245.7 379.6 191.1 317.1 191.1 250.9V247.2L143.1 209.5l.0001 38.61c0 89.65 63.97 169.6 151.1 181.7v34.15l-40 .0001c-17.67 0-31.1 14.33-31.1 31.1C223.1 504.8 231.2 512 239.1 512h159.1c8.838 0 15.1-7.164 15.1-15.1C415.1 478.3 401.7 464 383.1 464zM630.8 469.1l-159.3-124.9c15.37-25.94 24.53-55.91 24.53-88.21V216c0-13.25-10.75-24-23.1-24c-13.25 0-24 10.75-24 24l-.0001 39.1c0 21.12-5.559 40.77-14.77 58.24l-25.72-20.16c5.234-11.68 8.493-24.42 8.493-38.08l-.001-155.1c0-52.57-40.52-98.41-93.07-99.97c-54.37-1.617-98.93 41.95-98.93 95.95l0 54.25L38.81 5.111C34.41 1.673 29.19 0 24.03 0C16.91 0 9.839 3.158 5.12 9.189c-8.187 10.44-6.37 25.53 4.068 33.7l591.1 463.1c10.5 8.203 25.57 6.328 33.69-4.078C643.1 492.4 641.2 477.3 630.8 469.1z" />
              </svg>
            )}
          </div>
        </div>
      );
    else {
      return (
        <div className="hidden md:flex fixed md:absolute bottom-[20vh] left-0 md:top-0 h-6 w-6 m-1 flex justify-center items-center rounded-full bg-gray-700 opacity-50">
          {shareAudio ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 fill-white"
              viewBox="0 0 384 512"
            >
              <path d="M192 352c53.03 0 96-42.97 96-96v-160c0-53.03-42.97-96-96-96s-96 42.97-96 96v160C96 309 138.1 352 192 352zM344 192C330.7 192 320 202.7 320 215.1V256c0 73.33-61.97 132.4-136.3 127.7c-66.08-4.169-119.7-66.59-119.7-132.8L64 215.1C64 202.7 53.25 192 40 192S16 202.7 16 215.1v32.15c0 89.66 63.97 169.6 152 181.7V464H128c-18.19 0-32.84 15.18-31.96 33.57C96.43 505.8 103.8 512 112 512h160c8.222 0 15.57-6.216 15.96-14.43C288.8 479.2 274.2 464 256 464h-40v-33.77C301.7 418.5 368 344.9 368 256V215.1C368 202.7 357.3 192 344 192z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 fill-red-400"
              viewBox="0 0 640 512"
            >
              <path d="M383.1 464l-39.1-.0001v-33.77c20.6-2.824 39.98-9.402 57.69-18.72l-43.26-33.91c-14.66 4.65-30.28 7.179-46.68 6.144C245.7 379.6 191.1 317.1 191.1 250.9V247.2L143.1 209.5l.0001 38.61c0 89.65 63.97 169.6 151.1 181.7v34.15l-40 .0001c-17.67 0-31.1 14.33-31.1 31.1C223.1 504.8 231.2 512 239.1 512h159.1c8.838 0 15.1-7.164 15.1-15.1C415.1 478.3 401.7 464 383.1 464zM630.8 469.1l-159.3-124.9c15.37-25.94 24.53-55.91 24.53-88.21V216c0-13.25-10.75-24-23.1-24c-13.25 0-24 10.75-24 24l-.0001 39.1c0 21.12-5.559 40.77-14.77 58.24l-25.72-20.16c5.234-11.68 8.493-24.42 8.493-38.08l-.001-155.1c0-52.57-40.52-98.41-93.07-99.97c-54.37-1.617-98.93 41.95-98.93 95.95l0 54.25L38.81 5.111C34.41 1.673 29.19 0 24.03 0C16.91 0 9.839 3.158 5.12 9.189c-8.187 10.44-6.37 25.53 4.068 33.7l591.1 463.1c10.5 8.203 25.57 6.328 33.69-4.078C643.1 492.4 641.2 477.3 630.8 469.1z" />
            </svg>
          )}
        </div>
      );
    }
  };

  const RemoteCallScreenState = () => {
    if (remoteCallScreenOff == true)
      return (
        <div className="hidden md:flex fixed left-[10vw] top-[2vw] w-[64vw] h-[36vw] bg-black object-cover border-2 border-green-200 z-10 text-white flex justify-center items-center text-2xl">
          Remote camera is off
          <div className="absolute top-0 left-0 h-6 w-6 m-2 flex justify-center items-center rounded-full bg-gray-700 opacity-50">
            {remoteShareAudio ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 fill-white"
                viewBox="0 0 384 512"
              >
                <path d="M192 352c53.03 0 96-42.97 96-96v-160c0-53.03-42.97-96-96-96s-96 42.97-96 96v160C96 309 138.1 352 192 352zM344 192C330.7 192 320 202.7 320 215.1V256c0 73.33-61.97 132.4-136.3 127.7c-66.08-4.169-119.7-66.59-119.7-132.8L64 215.1C64 202.7 53.25 192 40 192S16 202.7 16 215.1v32.15c0 89.66 63.97 169.6 152 181.7V464H128c-18.19 0-32.84 15.18-31.96 33.57C96.43 505.8 103.8 512 112 512h160c8.222 0 15.57-6.216 15.96-14.43C288.8 479.2 274.2 464 256 464h-40v-33.77C301.7 418.5 368 344.9 368 256V215.1C368 202.7 357.3 192 344 192z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 fill-red-400"
                viewBox="0 0 640 512"
              >
                <path d="M383.1 464l-39.1-.0001v-33.77c20.6-2.824 39.98-9.402 57.69-18.72l-43.26-33.91c-14.66 4.65-30.28 7.179-46.68 6.144C245.7 379.6 191.1 317.1 191.1 250.9V247.2L143.1 209.5l.0001 38.61c0 89.65 63.97 169.6 151.1 181.7v34.15l-40 .0001c-17.67 0-31.1 14.33-31.1 31.1C223.1 504.8 231.2 512 239.1 512h159.1c8.838 0 15.1-7.164 15.1-15.1C415.1 478.3 401.7 464 383.1 464zM630.8 469.1l-159.3-124.9c15.37-25.94 24.53-55.91 24.53-88.21V216c0-13.25-10.75-24-23.1-24c-13.25 0-24 10.75-24 24l-.0001 39.1c0 21.12-5.559 40.77-14.77 58.24l-25.72-20.16c5.234-11.68 8.493-24.42 8.493-38.08l-.001-155.1c0-52.57-40.52-98.41-93.07-99.97c-54.37-1.617-98.93 41.95-98.93 95.95l0 54.25L38.81 5.111C34.41 1.673 29.19 0 24.03 0C16.91 0 9.839 3.158 5.12 9.189c-8.187 10.44-6.37 25.53 4.068 33.7l591.1 463.1c10.5 8.203 25.57 6.328 33.69-4.078C643.1 492.4 641.2 477.3 630.8 469.1z" />
              </svg>
            )}
          </div>
        </div>
      );
    if (remoteCallScreenOff == null && !created)
      return (
        <div className="hidden md:flex fixed left-[10vw] top-[2vw] w-[64vw] h-[36vw] animate-pulse bg-gray-700 text-green-300 object-cover border-2 border-green-200 z-10 text-black flex justify-center items-center text-2xl">
          Waiting another user to join...
        </div>
      );
    if (remoteCallScreenOff == null && created) {
      return "";
    }
    if (remoteCallScreenOff == false)
      return (
        <div className="hidden md:block fixed left-[10vw] top-[2vw]">
          <div className="absolute top-0 left-0 h-6 w-6 m-2 flex justify-center items-center rounded-full bg-gray-700 opacity-50">
            {remoteShareAudio ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 fill-white"
                viewBox="0 0 384 512"
              >
                <path d="M192 352c53.03 0 96-42.97 96-96v-160c0-53.03-42.97-96-96-96s-96 42.97-96 96v160C96 309 138.1 352 192 352zM344 192C330.7 192 320 202.7 320 215.1V256c0 73.33-61.97 132.4-136.3 127.7c-66.08-4.169-119.7-66.59-119.7-132.8L64 215.1C64 202.7 53.25 192 40 192S16 202.7 16 215.1v32.15c0 89.66 63.97 169.6 152 181.7V464H128c-18.19 0-32.84 15.18-31.96 33.57C96.43 505.8 103.8 512 112 512h160c8.222 0 15.57-6.216 15.96-14.43C288.8 479.2 274.2 464 256 464h-40v-33.77C301.7 418.5 368 344.9 368 256V215.1C368 202.7 357.3 192 344 192z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 fill-red-400"
                viewBox="0 0 640 512"
              >
                <path d="M383.1 464l-39.1-.0001v-33.77c20.6-2.824 39.98-9.402 57.69-18.72l-43.26-33.91c-14.66 4.65-30.28 7.179-46.68 6.144C245.7 379.6 191.1 317.1 191.1 250.9V247.2L143.1 209.5l.0001 38.61c0 89.65 63.97 169.6 151.1 181.7v34.15l-40 .0001c-17.67 0-31.1 14.33-31.1 31.1C223.1 504.8 231.2 512 239.1 512h159.1c8.838 0 15.1-7.164 15.1-15.1C415.1 478.3 401.7 464 383.1 464zM630.8 469.1l-159.3-124.9c15.37-25.94 24.53-55.91 24.53-88.21V216c0-13.25-10.75-24-23.1-24c-13.25 0-24 10.75-24 24l-.0001 39.1c0 21.12-5.559 40.77-14.77 58.24l-25.72-20.16c5.234-11.68 8.493-24.42 8.493-38.08l-.001-155.1c0-52.57-40.52-98.41-93.07-99.97c-54.37-1.617-98.93 41.95-98.93 95.95l0 54.25L38.81 5.111C34.41 1.673 29.19 0 24.03 0C16.91 0 9.839 3.158 5.12 9.189c-8.187 10.44-6.37 25.53 4.068 33.7l591.1 463.1c10.5 8.203 25.57 6.328 33.69-4.078C643.1 492.4 641.2 477.3 630.8 469.1z" />
              </svg>
            )}
          </div>
        </div>
      );
  };

  if (error == "host left") return <HostLeft />;

  return (
    <>
      <div
        className="fixed right-4 top-4 z-[1000] max-h-screen max-w-full overflow-auto"
        role="alert"
      >
        {alerts.length
          ? alerts.map((alert, index) => (
            <div
              key={index}
              className="min-w-[350px] max-w-sm bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 relative"
            >
              <p className="font-bold">{alert.title}</p>
              <span
                onClick={() => handleDeleteAlert(index)}
                className="absolute top-0 right-0 px-4 py-3"
              >
                <svg
                  className="fill-green-700 h-6 w-6"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
              </span>
              <p>{alert.content}</p>
            </div>
          ))
          : ""}
      </div>

      <div className="fixed flex w-full h-screen max-w-full max-h-screen overflow-hidden">
        {loading ? <Loading /> : ""}

        <div className="w-full h-[100vh] border-green-400 flex flex-wrap items-center">
          <div className="relative flex">
            <div className="relative">
              <div className="overflow-x-auto w-[calc(100vw-160vw/2.4)] h-[calc(90vw/2.4)] p-5 pb-16 bg-gray-300 relative custom-scroll-bar-chat">
                {messages.length
                  ? messages.map((message, index) => {
                    if (message.type == "chat break")
                      return (
                        <div key={index}>
                          <ChatBreak content={message.content} />
                        </div>
                      );
                    else if (message.from == "me" && message.type == "chat")
                      return (
                        <div key={index}>
                          <MeChat socketID={message.socketID} isOwner={message.isOwner} content={message.content} />
                        </div>
                      );
                    else if (message.from == "remote" && message.type == "chat")
                      return (
                        <div key={index}>
                          <RemoteChat socketID={message.socketID} isOwner={message.isOwner} content={message.content} />
                        </div>
                      );
                  })
                  : ""}
              </div>
              <ChatFooter
                handleAddChatFromMe={handleAddChatFromMe}
                handleAddCodeFromMe={handleAddCodeFromMe}
              />
            </div>
            <video
              ref={mainVideo}
              className="bg-gray-800 w-[calc(160vw/2.4)] h-[calc(90vw/2.4)] object-cover w-full border-4"
            >
            </video>
            <div className="absolute top-1 right-1 px-2 py-1 rounded-[10px] bg-gray-900 opacity-50 text-white">
              <i className="fa-solid fa-eye"></i>  12
            </div>
          </div>



          {isOwner && <div className="w-full">
            <div></div>
            <div className="flex items-center justify-center">
              {sharingScreen ? <StopShareScreenButton /> : <StartShareScreenButton />}
              {shareAudio ? <MuteButton /> : <UnmuteButton />}
              {shareCam ? <StopShareWebcamButton /> : <StartShareWebcamButton />}
              <div className="text-center">
                <div
                  onClick={handleEndCall}
                  className="flex items-center justify-center h-16 px-5 text-lg font-bold text-white mx-auto rounded-[16px] bg-red-500 hover:bg-red-600 hover:cursor-pointer mx-4"
                >
                  End Live
                </div>
              </div>
            </div>
          </div>}

        </div>


        <style jsx>{`
        /* width */
        ::-webkit-scrollbar {
          width: 4px;
          height: 5px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
          box-shadow: inset 0 0 5px grey;
          border-radius: 10px;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
          background: green;
          border-radius: 10px;
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
          background: #2c6696;
        }
      `}</style>
      </div>
    </>
  );
}
