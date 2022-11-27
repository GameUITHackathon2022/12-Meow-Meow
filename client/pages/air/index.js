import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import IntlMessages from "../../service/react-intl/IntlMessages";
import { useSelector, useDispatch } from "react-redux";
import { LoadingScreen, LoadingMinimal } from "../../components/loading";
import AuthPage from "../../service/auth/auth-page-wrappers/AuthPage";
import SecurePage from "../../service/auth/auth-page-wrappers/SecurePage";
import { SideNavBarLayout } from "../../components/layout/sidenavbar";
import { NavBarLayout } from "../../components/layout/navbar";

import HomePageImg1 from "../../public/asset/home_page_1.jpg";

export default function AirHome() {
  const clientConfig = useSelector((state) => state);
  return (
    <NavBarLayout>
      <div className="bg-white dark:bg-neutral m-0">
        <Head>
          <title><IntlMessages id="app.name" /></title>
        </Head>
        <div className="flex justify-center flex-col m-0 py-5 md:py-16 px-0 md:px-20">
          <div className="grow grid grid-cols-2 w-full px-5 md:px-20 mb-10">
            <div className="col-span-2 w-60 justify-self-center md:hidden">
              <Image src={HomePageImg1} className="w-full" alt="homepage1" />
            </div>
            <div className="col-span-2 grid grid-cols-1 place-content-center md:col-span-1">
              <p className="text-2xl md:text-4xl lg:text-5xl text-gray-700 capitalize font-bold">
                <IntlMessages id="main.home.slogan.label" />
              </p>
              <p className="text-lg md:text-xl text-gray-700 normalize py-3">
                <IntlMessages id="main.home.description" />
              </p>
              <Link href="/air/analyse" className=" btn btn-primary rounded-none normal-case p-1">
                <IntlMessages id="main.home.analyse.label" />
              </Link>
              <p className="text-sm md:text-ld text-gray-700 normal-case text-right py-3">
                by Meow Meow team
              </p>
            </div>
            <div className="hidden md:grid md:col-span-1">
              <Image src={HomePageImg1} className="w-full" alt="homepage1" />
            </div>
          </div>
          <div className="md:px-10">
            <div className="bg-[url('/asset/airpollution-backdrop.png')]">
              <div className="grow flex flex-col w-full bg-gray-700/[0.5] px-5 md:px-20 py-36 h-full">
                <div className="grow">
                  <p className="text-sm font-semibold text-white uppercase">
                    <IntlMessages id="main.air.solution.label" />
                  </p>
                  <p className="text-5xl text-white capitalize font-bold">
                    <IntlMessages id="main.air.solution.question.label" />
                  </p>
                  <p className="ml-10 mt-3 text-white max-w-sm">
                    <IntlMessages id="main.air.solution.question.alt" />
                  </p>
                </div>
                <div className="relative top-24 mx-auto grow justify-self-center container w-4/5 bg-white shadow h-fit">
                  <div className="grid grid-cols-3 p-5">
                    <div className="col-span-3 md:col-span-1">
                      <p className="font-semibold text-gray-700 capitalize">
                        1.{" "}
                        <span className="text-primary hover:text-secondary">
                          <Link href="#defination">
                            <IntlMessages id="main.air.definition.sectionLabel" />
                          </Link>
                        </span>
                      </p>
                      <p className="font-semibold text-gray-700 capitalize">
                        2.{" "}
                        <span className="text-primary hover:text-secondary">
                          <Link href="#causes">
                            <IntlMessages id="main.air.causes.sectionLabel" />
                          </Link>
                        </span>
                      </p>
                      <p className="font-semibold text-gray-700 capitalize">
                        3.{" "}
                        <span className="text-primary hover:text-secondary">
                          <Link href="#effects">
                            <IntlMessages id="main.air.effects.sectionLabel" />
                          </Link>
                        </span>
                      </p>
                      <p className="font-semibold text-gray-700 capitalize">
                        4.{" "}
                        <span className="text-primary hover:text-secondary">
                          <Link href="#solutions">
                            <IntlMessages id="main.air.solution.sectionLabel" />
                          </Link>
                        </span>
                      </p>
                    </div>
                    <div className="col-span-3 md:col-span-2 grid content-center justify-items-center">
                      <p className="text-2xl font-bold">
                        <IntlMessages id="main.analyse.air.label" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavBarLayout>
  );
}
