import { useState, useRef } from "react";

const style = {
  position: "absolute",
  top: "45%",
  left: "50%",
  width: "70vw",
  height: "75vh",
  transform: "translate(-50%, -50%)",
  bgcolor: "#000",
  border: "2px solid #000",
  boxShadow: 24,
};

export default function ChatFooter({ handleAddChatFromMe, handleAddCodeFromMe }) {
  const [showInputCodeModal, setShowInputCodeModal] = useState(false);

  const [message, setMessage] = useState("");
  const [codeActive, setCodeActive] = useState(false);

  const inputFile = useRef();
  const inputImage = useRef();
  
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const handleUploadImage = (e) =>{
    const files = e.target.files;
    if (!files.length) return;
    getBase64(files[0])
    .then((data) => console.log(data))
    .catch((err) => console.log(err))
  };

  const handleUploadFile = (e) =>{
    console.log(e.target.value);
    if (e.target.files[0] > 1048576 * 25) {
      alert("Please input file < 25 MB");
      e.target.value = "";
    }
  };

  const handleInputOnChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message == "") return;
    handleAddChatFromMe({content : message});
    setMessage("");
  };

  const handleInputOnKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleOpenInputCodeModal = () => {
    setCodeActive(true);
    setShowInputCodeModal(true);
  };

  const handleCloseInputCodeModal = () => {
    setCodeActive(false);
    setShowInputCodeModal(false);
  };

  return (
    <>
      <div className="absolute left-0 bottom-0 w-full h-[40px] bg-green-900">
        <div className="relative flex">
          <input
            onChange={handleInputOnChange}
            onKeyDown={handleInputOnKeyDown}
            type="text"
            value={message}
            placeholder="Write your message!"
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-200 placeholder-gray-600 pl-2 bg-transparent py-1 h-[40px] w-[490px]"
          />
          <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
            <input id="file-input" ref={inputFile} type="file" className="hidden" onChange={handleUploadFile}/>

            <button
              onClick={() => inputImage.current.click()}
              type="button"
              className="inline-flex items-center justify-center rounded-full h-[40px] w-[40px] transition duration-500 ease-in-out text-gray-300 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </button>

            <input id="file-input" ref={inputImage} type="file" className="hidden" accept="images/*" onChange={handleUploadImage}/>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-[40px] w-[40px] transition duration-500 ease-in-out text-gray-300 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </button>
            <button
              onClick={handleSendMessage}
              type="button"
              className="inline-flex items-center justify-center rounded-lg mx-2 transition duration-500 text-white ease-in-out hover:text-gray-400 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-6 w-6 transform rotate-90"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
