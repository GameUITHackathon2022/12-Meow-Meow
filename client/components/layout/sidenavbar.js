import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { setShowSidebar } from "../../service/redux/slices/config";
import SideBar from "../menu/sidebar";
import NavBar from "../menu/navbar";

export const SideNavBarLayout = ({
  children,
  sideBar = false,
  bgColor,
  txtColor,
}) => {
  const [sideNavBar] = useAutoAnimate({ duration: 150, easing: "linear" });
  const dispatch = useDispatch();
  const clientConfig = useSelector((state) => state);
  const showSidebar = clientConfig.config.showSidebar;
  const sidebarToggle = () => {
    dispatch(setShowSidebar(!showSidebar));
    setShowMenuDropdown(false);
  };
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const menuDropdownToggle = () => {
    if (showSidebar) dispatch(setShowSidebar(!showSidebar));
    setShowMenuDropdown(!showMenuDropdown);
  };
  return (
    <div className="">
      <header className="block fixed w-full z-20">
        <NavBar
          sidebarToggle={sidebarToggle}
          showMenuDropdown={showMenuDropdown}
          menuDropdownToggle={menuDropdownToggle}
          sidebar={sideBar}
          bgColor={bgColor}
          txtColor={txtColor}
        />
      </header>
      <main className="flex w-full h-full">
        <div ref={sideNavBar}>
          {showSidebar && (
            <div
              className={`inline-flex relative w-screen md:w-60 h-auto md:top-7 top-12 z-10`}
            >
              <SideBar sidebarToggle={sidebarToggle} />
            </div>
          )}
        </div>

        <div
          className={`relative w-full h-full md:top-12 top-16 z-0 ${
            showSidebar && "left-0"
          } overflow-y-visible`}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default SideNavBarLayout;
