import Head from "next/head";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import IntlMessages from "../../../service/react-intl/IntlMessages";
import { useSelector, useDispatch } from "react-redux";
import AuthPage from "../../../service/auth/auth-page-wrappers/AuthPage";
import SecurePage from "../../../service/auth/auth-page-wrappers/SecurePage";
import { SideNavBarLayout } from "../../../components/layout/sidenavbar";
import MultiLineChart from "../../../components/chart/multiline";
import { InputCityWithLabel, InputWithLabel } from "../../../components/input";
import { getAirQuality } from "../../../service/open-meteo";
import GetTranslateText from "../../../service/react-intl/getTranslateText";
import { collapseToast } from "react-toastify";
import { loggedIn } from "../../../service/auth";
import { Axios } from "../../../service/axios/config";
import { toast } from "react-hot-toast";

export default function Air() {
  const clientConfig = useSelector((state) => state);
  const [response, setResponse] = useState({});
  const [showChart, setShowChart] = useState(false);
  const authUser = loggedIn();
  let data = [
    {
      id: "startDate",
      label: GetTranslateText("main.analyse.air.startDate.label"),
      alt: GetTranslateText("main.analyse.air.startDate.alt"),
      type: "date",
      placeHolder: "",
      isValidate: false,
      value: "",
      check: "date",
    },
    {
      id: "endDate",
      label: GetTranslateText("main.analyse.air.endDate.label"),
      alt: GetTranslateText("main.analyse.air.endDate.alt"),
      type: "date",
      placeHolder: "",
      isValidate: false,
      value: "",
      check: "date",
    },
    {
      id: "city",
      label: GetTranslateText("main.analyse.air.city.label"),
      alt: GetTranslateText("main.analyse.air.city.alt"),
      type: "city",
      placeHolder: "",
      isValidate: false,
      value: "",
      check: "",
    },
    {
      id: "description",
      label: GetTranslateText("main.analyse.air.description.label"),
      alt: "",
      type: "text",
      placeHolder: "",
      isValidate: false,
      value: "",
      check: "",
    },
  ];

  async function getData(data) {
    console.log(data);
    setShowChart(false);
    try {
      if (data[0].value != "" && data[1].value != "" && data[2].value != "") {
        var param = new URLSearchParams({
          latitude: data[2].value.latitude,
          longitude: data[2].value.longitude,
          start_date: data[0].value,
          end_date: data[1].value,
        });
        param = param.toString();
        param = "?" + param + "&hourly=pm2_5,carbon_monoxide,uv_index";
        var res = await getAirQuality(param);
        setResponse(res);
        setShowChart(true);
      } else console.log(false);
    } catch {
      console.log(false);
    }
  }

  async function addTopic(data) {
    try {
      await getData(data);
      const location = `${data[2].value.latitude},${data[2].value.longitude}`;
      const dateStarted = data[0].value;
      const dateEnded = data[1].value;
      const content = data[3].value;
      const req = {
        content,
        location,
        dateStarted,
        dateEnded,
        title: "meowmeow",
        path: "meow",
      };
      Axios.post("/question/add", req).then((response) => {
        toast.success("response");
        console.log(response);
      });
    } catch {
      toast.error("Error");
    }
  }

  return (
    <SideNavBarLayout>
      <div className="dark:bg-neutral m-0">
        <Head>
          <title>
            <IntlMessages id="app.name" /> - <IntlMessages id="main.analyse.air.label" />
          </title>
        </Head>
        <div className="flex justify-center flex-col m-0 py-5 md:py-16">
          <div className="w-full px-5 md:px-20">
            <p className="text-2xl text-gray-700 capitalize font-bold">
              <IntlMessages id="main.analyse.air.label" />
            </p>
          </div>
          {/* <div className="grow grid grid-cols-2 w-full px-5 md:px-20 mb-10">
              <div className="">
                <p className="text-2xl text-gray-700 capitalize font-bold">
                  <IntlMessages id="main.analyse.air.label" />
                </p>
              </div>
              <div className="">
                <Image src={HomePageImg1} className="w-full" alt="homepage1"/>
              </div>
            </div> */}
          <div className="grow w-full px-5 md:px-20 mb-10">
            <div className="grid grid-cols-2 gap-5">
              {data.map((data, index) => {
                if (data.type == "city")
                  return (
                    <div className="col-span-2">
                      <InputCityWithLabel data={data} key={data.id} />
                    </div>
                  );
                if (data.id == "description" && authUser)
                  return (
                    <div className="col-span-2">
                      <InputWithLabel data={data} key={data.id} />
                    </div>
                  );
                else if (data.id == "description") return <></>;
                else return <InputWithLabel data={data} key={data.id} />;
              })}
            </div>
            {authUser && (
              <button
                onClick={() => addTopic(data)}
                className="btn btn-primary btn-md mt-5 float-right normal-case w-full text-white"
              >
                <IntlMessages id="main.analyse.air.addTopic.label" />
              </button>
            )}
            <button
              onClick={() => getData(data)}
              className="btn btn-primary btn-md mt-5 float-right normal-case w-full text-white"
            >
              <IntlMessages id="main.analyse.air.getChart.label" />
            </button>
          </div>
          <div className="grow grid grid-cols-2 w-full px-5 md:px-20 mb-10">
            {showChart && <MultiLineChart value={response.hourly} />}
          </div>
        </div>
      </div>
    </SideNavBarLayout>
  );
}
