import React from "react";

export default function MeChat({ socketID, isOwner, content, children }) {
  return (
    <div className="text-right">
      <div className="text-[12px] font-bold text-gray-600 flex items-center justify-end">
      {isOwner ? <img src="https://cdn-icons-png.flaticon.com/512/6941/6941697.png" className="h-5 w-5 mr-2"></img> : <></>}{socketID}
      </div>
      <div className="flex justify-end mb-4">
        <p className="text-white mr-3 bg-green-800 px-5 py-2 rounded-xl max-w-[300px] break-words relative">
          {content || children}

        </p>
        <div className="relative">
          <img src="/images/default-profile-pic.jpg" className="w-10 h-10 rounded-full"></img>
        </div>
      </div>
    </div>
  );
}
