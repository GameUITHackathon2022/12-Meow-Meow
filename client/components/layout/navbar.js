import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NavBar from "../menu/navbar";

export const NavBarLayout = ({ children }) => {
  const dispatch = useDispatch();
  const clientConfig = useSelector((state) => state);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const menuDropdownToggle = () => {
    setShowMenuDropdown(!showMenuDropdown);
  };
  return (
    <div className="">
      <header className="block fixed w-full z-20">
        <NavBar
          sidebar={false}
          showMenuDropdown={showMenuDropdown}
          menuDropdownToggle={menuDropdownToggle}
        />
      </header>
      <main className="flex w-full h-full">
        <div
          className={`relative w-full h-full md:top-12 top-16 z-0 overflow-y-visible`}
        >
          {children}
        </div>
      </main>
    </div>
  );
};
