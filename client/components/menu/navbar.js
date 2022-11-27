import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/asset/logo.png";
import { BsFillGrid3X3GapFill, BsList } from "react-icons/bs";
import IntlMessages from "../../service/react-intl/IntlMessages";
import LanguageSwichter from "../switcher/language/index";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { NavMenu } from "./menu";
import { useRouter } from "next/router";
import { loggedIn } from "../../service/auth";
import { MdLogout } from "react-icons/md";
import { useAuth } from "../../service/auth";
import { useSelector } from "react-redux";
import user from "../../service/redux/slices/user";
import { useEffect } from "react";

// Dropdown cho mobile
const MenuDropdownMobile = ({ children, menuDropdownToggle }) => {
  const { asPath, pathname } = useRouter();

  const authUser = loggedIn();
  return (
    <div className="grid grid-flow-row auto-rows-max fixed top-16 right-0 w-full h-full bg-white text-black dark:bg-gray-100 dark:text-white shadow-xl rounded-sm text-sm px-3 py-5 m-0">
      <div className="grid grid-flow-row auto-rows-max">
        {NavMenu.map((NavMenu, index) => {
          if (NavMenu.type == "link")
            return (
              <Link
                key={NavMenu.id}
                href={NavMenu.src}
                className={`cursor-pointer hover:text-primary p-3 ${
                  asPath.includes(NavMenu.src) && "text-primary"
                }`}
                onClick={menuDropdownToggle}
              >
                <IntlMessages id={NavMenu.label} />
              </Link>
            );
        })}
        {!authUser && (
          <>
            <Link
              key={`login-menu`}
              href="/signin"
              className={`btn btn-outline btn-primary btn-sm cursor-pointer hover:text-gray-200  rounded-none p-1 mb-2 mt-2 normal-case ${
                asPath.includes("/signin") && "text-gray-700"
              }`}
            >
              <IntlMessages id={`main.login.title`} />
            </Link>
            <Link
              key={`register-menu`}
              href="/register"
              className={`btn btn-primary btn-sm cursor-pointer hover:text-gray-200  rounded-none p-1 normal-case ${
                asPath.includes("/register") && "text-gray-700"
              }`}
            >
              <IntlMessages id={`main.register.label.register.button`} />
            </Link>
          </>
        )}
      </div>
      <div className="divider divider-horizonal"></div>
      <div className="container">{children}</div>
    </div>
  );
};

export default function NavBar({
  sidebarToggle,
  sidebar = true,
  showMenuDropdown,
  menuDropdownToggle,
  bgColor = "white",
  txtColor = "primary",
}) {
  const user = useSelector((data) => data.user);
  var name = null
  try {
    name = user.info.name
  } catch (err) {}

  const [navBar] = useAutoAnimate({ duration: 150, easing: "linear" });
  const { asPath, pathname } = useRouter();
  const authUser = loggedIn();
  const { userSignOut } = useAuth();
  const color = {
    air: "[#c4c4c4]",
    primary: "primary",
    white: "white",
    "gray-400": "[#3f3f46]",
  };

  return (
    <div
      className={`flex px-5 md:px-8 py-5 justify-between items-center w-full h-18 md:h-12 bg-${color[bgColor]} text-${color[txtColor]}`}
    >
      <div className="flex flex-row items-center">
        {sidebar && (
          <button className="text-xl mr-3" onClick={sidebarToggle}>
            <BsFillGrid3X3GapFill />
          </button>
        )}
        <Link href="/" className="flex flex-row items-center">
          <Image src={Logo} className="w-8 mr-2" alt="logo-navbar" />
          <span className="text-xl font-semibold">
            <IntlMessages id="app.name" />
          </span>
        </Link>
      </div>
      <div
        className="flex flex-row items-center text-sm font-semibold"
        ref={navBar}
      >
        <button
          className="block md:hidden text-xl"
          onClick={menuDropdownToggle}
        >
          <BsList />
        </button>
        <div
          className={`grid-flow-col auto-cols-max content-center place-items-center gap-0 w-fit md:grid hidden text-${color[txtColor]}`}
        >
          {NavMenu.map((NavMenu, index) => {
            if (NavMenu.type == "link")
              return (
                <Link
                  key={NavMenu.id}
                  href={NavMenu.src}
                  className={`cursor-pointer hover:text-gray-700 px-3 ${
                    asPath.includes(NavMenu.src) && "text-gray-700"
                  }`}
                >
                  <IntlMessages id={NavMenu.label} />
                </Link>
              );
          })}
          {!authUser && (
            <>
              <Link
                key={`login-menu`}
                href="/signin"
                className={`btn btn-outline btn-primary btn-sm cursor-pointer hover:text-gray-200  rounded-none p-1 ml-2 normal-case ${
                  asPath.includes("/signin") && "text-gray-700"
                }`}
              >
                <IntlMessages id={`main.login.title`} />
              </Link>
              <Link
                key={`register-menu`}
                href="/register"
                className={`btn btn-primary btn-sm cursor-pointer hover:text-gray-200  rounded-none p-1 normal-case ${
                  asPath.includes("/register") && "text-gray-700"
                }`}
              >
                <IntlMessages id={`main.register.label.register.button`} />
              </Link>
            </>
          )}
          { authUser && (
            <>
              <div className="divider divider-horizontal mx-1"></div>
              <p className="font-semibold text-primary text-sm">
                {user.info.name}
              </p>
              <button
                className="ml-2 text-xl cursor-pointer"
                onClick={userSignOut}
              >
                <MdLogout />
              </button>
            </>
          )}
        </div>
        <div className="divider divider-horizontal mx-1 hidden md:flex"></div>
        <div className="md:inline-flex hidden">
          <LanguageSwichter />
        </div>
        {showMenuDropdown && (
          <MenuDropdownMobile menuDropdownToggle={menuDropdownToggle}>
            <div className="flex flex-row justify-between items-center text-sm font-semibold">
              <LanguageSwichter />
              {authUser && (
                <div className="flex">
                  <p className="font-semibold text-primary text-sm">
                    { name != null && name }
                  </p>
                  <button
                    className="ml-2 text-xl cursor-pointer"
                    onClick={userSignOut}
                  >
                    <MdLogout />
                  </button>
                </div>
              )}
            </div>
          </MenuDropdownMobile>
        )}
      </div>
    </div>
  );
}
