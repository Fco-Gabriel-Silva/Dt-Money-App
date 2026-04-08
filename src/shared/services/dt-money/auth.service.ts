import { FormLoginParams } from "@/screens/Login/LoginForm";
import { dtMoneyApi } from "@/shared/api/dt-money";
import { IAuthenticateResponse } from "@/shared/interfaces/https/authenticate-response";
import { getDeviceInfoPayload } from "../firebase/notifications";

export const authenticate = async (
  userData: FormLoginParams,
): Promise<IAuthenticateResponse> => {
  const deviceInfo = await getDeviceInfoPayload();

  const payload = {
    ...userData,
    ...deviceInfo,
  };

  const { data } = await dtMoneyApi.post<IAuthenticateResponse>(
    "/auth/login",
    payload,
  );

  return data;
};

export const registerUser = async (
  userData: FormLoginParams,
): Promise<IAuthenticateResponse> => {
  const deviceInfo = await getDeviceInfoPayload();

  const payload = {
    ...userData,
    ...deviceInfo,
  };

  const { data } = await dtMoneyApi.post<IAuthenticateResponse>(
    "/auth/register",
    payload,
  );

  return data;
};
