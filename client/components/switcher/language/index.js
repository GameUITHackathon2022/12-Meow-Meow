import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLang } from "../../../service/redux/slices/config";
import GetTranslateText from "../../../service/react-intl/getTranslateText";
import { BsTranslate } from "react-icons/bs";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import IntlMessages from "../../../service/react-intl/IntlMessages";

const LangDropdown = ({ handleLanguage }) => {
  const langPack = [
    {
      id: "en",
      name: GetTranslateText("main.language.en.label"),
      flag: null,
    },
    {
      id: "vi",
      name: GetTranslateText("main.language.vi.label"),
      flag: null,
    },
  ];

  return (
    <div className="grid-flow-row auto-rows-max absolute top-10 md:top-12 md:right-2 bg-white text-black dark:bg-gray-100 dark:text-white shadow rounded border border-gray-300  text-sm p-2">
      {langPack.map((langPack, index) => {
        return (
          <div
            key={langPack.id}
            className="p-2 hover:bg-primary/[0.5] cursor-pointer rounded-sm"
            onClick={() => handleLanguage(langPack.id)}
          >
            <p>{langPack.name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default function LanguageSwichter() {
  const [languageSwichter] = useAutoAnimate({
    duration: 150,
    easing: "linear",
  });
  const dispatch = useDispatch();
  const clientConfig = useSelector((state) => state);
  const lang = clientConfig.config.language;
  const [showDropdown, setShowDropdown] = useState(false);
  const handleLanguage = (id) => {
    dispatch(setLang(id));
    setShowDropdown(!showDropdown);
  };
  return (
    <div className="flex p-1 m-0 cursor-pointer" ref={languageSwichter}>
      <p
        className="flex items-center uppercase text-sm font-semibold text-center"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <BsTranslate className="text-lg mr-2" />
        <span className="inline-flex normal-case md:hidden mr-1">
          <IntlMessages id="main.language.label" />: 
        </span>
        {lang}
      </p>
      {showDropdown && <LangDropdown handleLanguage={handleLanguage} />}
    </div>
  );
}
