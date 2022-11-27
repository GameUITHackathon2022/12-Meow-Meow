import IntlMessages from "../../service/react-intl/IntlMessages";
import { SideBarMenu } from "./menu";
import CollapseSidebar from "../collapse";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { MdLogout } from "react-icons/md";

export default function SideBar({sidebarToggle}) {
  const { asPath, pathname } = useRouter();
  return (
    <div className="mx-0 pb-20 w-full md:w-60 h-full bg-white block fixed overflow-y-auto md:border-gray-200 md:border-r md:shadow-xl divide-y-2">
      <div className="pt-10 pb-10 px-5">
        <div href="#!">
          <div className="flex items-center">
            <div className="shrink-0">
              <Image
                className="rounded-full"
                src="https://i.pravatar.cc/300"
                width={50}
                height={50}
                alt="user-avatar"
                />
            </div>
            <div className="shrink-0 ml-3">
              <p className="font-semibold text-primary">
                Meow Meow Team
              </p>
            </div>
            <div className="shrink-0 text-2xl">
              <MdLogout/>
            </div>
          </div>
        </div>
      </div>
      <ul className="px-1">
        {SideBarMenu.map((value, index) => {
          if (value.type == "collapse")
            return <CollapseSidebar value={value} key={value.id} sidebarToggle={sidebarToggle}/>;
          else
            return (
              <li className="relative" key={value.id} onClick={sidebarToggle}>
                <Link
                  className={`flex items-center justify-between text-sm py-4 px-6 h-12 overflow-hidden font-semibold text-ellipsis whitespace-nowrap rounded  hover:bg-blue-50 transition duration-300 ease-in-out cursor-pointer ${
                    asPath.includes(value.src)
                      ? "text-primary"
                      : "text-gray-700"
                  }`}
                  href={value.src}
                >
                  <p className="flex items-center">
                    <span className="mr-1 text-lg">{value.icon}</span>
                    <IntlMessages id={value.label} />
                  </p>
                </Link>
              </li>
            );
        })}
      </ul>
    </div>
  );
}
{
  /* <div className="pt-4 pb-2 px-6">
        {SideBarMenu.map((value, index)=> {
          if (value.type == "collapse") 
            return <CollapseSidebar label={value.label} src={value.src} key={value.id}/>
          else 
          return <Link className="" href={value.src} key={value.id}><IntlMessages id={value.label}/></Link>
        }
        )}
      </div> */
}
