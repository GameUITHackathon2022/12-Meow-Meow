import React, { useState, useEffect } from "react";
import validator from "validator";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { getCity } from "../../service/open-meteo";

function checkInput(data) {
  switch (data.check) {
    case "email":
      if (validator.isEmail(data.value)) return true;
      else return false;
    case "password":
      if (
        validator.isStrongPassword(data.value, {
          minLength: 8,
          minLowercase: 0,
          minUppercase: 0,
          minNumbers: 0,
          minSymbols: 0,
        })
      )
        return true;
      else return false;
    case "date":
      try {
        console.log(validator.isDate(data.value));
        if (validator.isDate(data.value)) return true;
        else return false;
      } catch {
        return false;
      }
    default:
      if (!validator.isEmpty(data.value)) return true;
      else return false;
  }
}

export const InputWithLabel = ({ data }) => {
  const [value, onChange] = useState(data.value);
  const [type, setType] = useState(data.type);
  const [isValidate, setValidate] = useState(checkInput(data));
  useEffect(() => {
    data.value = value;
    data.isValidate = isValidate;
    setValidate(checkInput(data));
  }, [value]);
  const passwordToggle = () => {
    if (type === "password") setType("text");
    else setType("password");
  };

  return (
    <div className="form-control w-full mb-2" key={data.id}>
      <label className="label">
        <span className="label-text font-semibold">{data.label}</span>
        <span className="label-text-alt">{data.alt}</span>
      </label>
      {data.type == "password" && (
        <label className="input-group">
          <input
            type={type}
            placeholder={data.placeHolder}
            className={`input border-2 ${
              isValidate ? `border-gray-300` : `border-red-300`
            } ${
              isValidate ? `focus:border-primary` : `focus:border-red-600`
            } focus:ring-0 focus:outline-0 w-full text-sm font-medium h-10 p-3
          `}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="bg-primary">
            <button onClick={() => passwordToggle()} className="text-white">
              {type === "password" ? <FaEye /> : <FaEyeSlash />}
            </button>
          </span>
        </label>
      )}
      {data.type != "password" && (
        <input
          type={data.type}
          placeholder={data.placeHolder}
          className={`input border-2 ${
            isValidate ? `border-gray-300` : `border-red-300`
          } ${
            isValidate ? `focus:border-primary` : `focus:border-red-600`
          } focus:ring-0 focus:outline-0 w-full text-sm font-medium h-10 p-3
          `}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
};

export const InputCityWithLabel = ({ data }) => {
  const [value, setValue] = useState("");
  const [isValidate, setValidate] = useState(true);
  const [cordinate, setCordinate] = useState(null);
  const [search, setSearch] = useState({});
  const [openDropdown, setOpenDropdown] = useState(false);
  useEffect(() => {
    data.value = cordinate;
    data.isValidate = isValidate;
  }, [value]);
  function setCity(latitude, longitude, name) {
    setValue(name);
    setCordinate({ latitude: latitude, longitude: longitude });
    setOpenDropdown(false);
    setValidate(true);
    console.log(data)
  }
  async function onSearch(value) {
    setValue(value);
    var data = new URLSearchParams({
      name: value,
    });
    data = data.toString(); 
    data = "?" + data;
    var list = await getCity(data);
    try {
      if (list.results) {
        setSearch(list);
        setOpenDropdown(true);
      } else {
        setOpenDropdown(false);
      }
    } catch {
      setOpenDropdown(false);
    }
  }

  return (
    <div className="form-control w-full mb-2" key={data.id}>
      <label className="label">
        <span className="label-text font-semibold">{data.label}</span>
        <span className="label-text-alt">{data.alt}</span>
      </label>
      <input
        type={"text"}
        placeholder={data.placeHolder}
        className={`input border-2 ${
          isValidate ? `border-gray-300` : `border-red-300`
        } ${
          isValidate ? `focus:border-primary` : `focus:border-red-600`
        } focus:ring-0 focus:outline-0 w-full text-sm font-medium h-10 p-3
          `}
        value={value}
        onChange={(e) => onSearch(e.target.value)}
      />
      {openDropdown && (
        <div className="relative flex flex-col p-2 gap-2 border border-gray-100 shadow rounded bg-white">
          {search.results.map((data, index) => {
            return (
              <p
                key={data.id}
                onClick={() =>
                  setCity(
                    data.latitude,
                    data.longitude,
                    data.name + ", " + data.country
                  )
                }
                className="cursor-pointer text-sm text-gray-700"
              >
                {data.name}, {data.country}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InputWithLabel;
