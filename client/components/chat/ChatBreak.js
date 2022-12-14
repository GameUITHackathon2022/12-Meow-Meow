import React from "react";

export default function ChatBreak({content}) {
  return (
    <div className="flex py-2 items-center">
      <div className="flex-grow border-t border-green-400"></div>
      <span className="flex-shrink mx-2 text-green-400 text-sm">{content}</span>
      <div className="flex-grow border-t border-green-400"></div>
    </div>
  );
}
