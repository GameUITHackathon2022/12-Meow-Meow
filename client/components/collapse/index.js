import IntlMessages from "../../service/react-intl/IntlMessages";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsPlus, BsArrowBarUp } from "react-icons/bs";
import { useRouter } from 'next/router';

export default function CollapseSidebar({ children, value, sidebarToggle}) {
  const [collapse] = useAutoAnimate({ duration: 150, easing: "linear" });
  const [open, setOpen] = useState(false);
  const { asPath, pathname } = useRouter();
  return (
    <li className="relative" ref={collapse}>
      <div
        className={`flex items-center justify-between text-sm py-4 px-6 h-12 overflow-hidden font-semibold text-gray-700 text-ellipsis whitespace-nowrap rounded  hover:bg-blue-50 transition duration-300 ease-in-out cursor-pointer`}
        onClick={() => setOpen(!open)}
      >
        <p className="flex items-center">
          <span className="mr-1 text-lg">{value.icon}</span>
          <IntlMessages id={value.label} />
        </p>
        <p>{open ? <BsArrowBarUp /> : <BsPlus />}</p>
      </div>
      {open && (
        <div className="p-0">
          {value.src.map((value, index) => {
            return (
              <div className="relative" key={value.id} onClick={sidebarToggle}>
                <Link
                  className={`flex items-center justify-between text-sm py-4 px-6 pl-8 h-12 overflow-hidden font-semibold text-ellipsis whitespace-nowrap rounded  hover:bg-blue-50 transition duration-300 ease-in-out cursor-pointer ${asPath.includes(value.src) ? "text-primary" : "text-gray-700"}`}
                  href={value.src}
                >
                  <p className="flex items-center">
                    <span className="mr-1 text-lg">{value.icon}</span>
                    <IntlMessages id={value.label} />
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </li>
  );
}
