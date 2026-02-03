import { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAuthenticateResponse } from "../interfaces/https/authenticate-response";

export const addTokenToRequest = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(async (config: any) => {
    const userData = await AsyncStorage.getItem("dt-money-user");

    if (userData) {
      const { token } = JSON.parse(userData) as IAuthenticateResponse;

      if (token) {
        if (!config.headers) {
          config.headers = {};
        }

        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });
};
