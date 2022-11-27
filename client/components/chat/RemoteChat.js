import React from "react";

export default function RemoteChat({ socketID, isOwner, content, children }) {
  return (
    <div className="text-left">
      <div className="text-[12px] font-bold text-gray-600 flex items-center justify-start">
        {isOwner ? <img src="https://cdn-icons-png.flaticon.com/512/6941/6941697.png" className="h-5 w-5 mr-2"></img> : <></>}{socketID}
      </div>
      <div className="flex justify-start mb-4">
        <img src="/images/default-profile-pic.jpg" className="w-10 h-10 rounded-full"></img>
        <p className="text-white ml-3 bg-green-800 px-5 py-2 rounded-xl max-w-[300px] break-words relative">
          {content || children}
        </p>
      </div>
    </div>

  );
}
