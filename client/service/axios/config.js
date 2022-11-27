import axios from 'axios';

export const Axios = axios.create({
  baseURL: `https://env-buddy.herokuapp.com/api/`,
  withCredentials: true,
});


export const GeocodingApi = axios.create({
  baseURL: "https://geocoding-api.open-meteo.com/v1",
  // headers: {
  //   'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH',
  //   'Access-Control-Allow-Credentials': true,
  //   'Content-Type': 'application/json;charset=UTF-8',
  //   "Access-Control-Allow-Origin": "*",
  // },
  // withCredentials: true,
});

export const AirQualityApi = axios.create({
  baseURL: "https://air-quality-api.open-meteo.com/v1",
  // headers: {
  //   'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH',
  //   'Access-Control-Allow-Credentials': true,
  //   'Content-Type': 'application/json;charset=UTF-8',
  //   "Access-Control-Allow-Origin": "*",
  // },
  // withCredentials: true,
});
