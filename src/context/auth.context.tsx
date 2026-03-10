import { FormLoginParams } from "@/screens/Login/LoginForm";
import { FormRegisterParams } from "@/screens/Register/RegisterForm";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import * as authService from "@/shared/services/dt-money/auth.service";
import * as userService from "@/shared/services/dt-money/user.service";
import { IUser } from "@/shared/interfaces/user-interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAuthenticateResponse } from "@/shared/interfaces/https/authenticate-response";
import { UpdateUserRequest } from "@/shared/interfaces/https/update-user-request";

type AuthContextType = {
  user: IUser | null;
  token: string | null;
  handleAuthenticate: (params: FormLoginParams) => Promise<void>;
  handleRegister: (params: FormRegisterParams) => Promise<void>;
  handleLogout: () => void;
  restoreUserSession: () => Promise<string | null>;
  updateUser: (params: UpdateUserRequest) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleAuthenticate = async (userData: FormLoginParams) => {
    const { token, user } = await authService.authenticate(userData);
    await AsyncStorage.setItem(
      "dt-money-user",
      JSON.stringify({ user, token }),
    );
    setUser(user);
    setToken(token);
  };

  const handleRegister = async (formData: FormRegisterParams) => {
    const { token, user } = await authService.registerUser(formData);
    await AsyncStorage.setItem(
      "dt-money-user",
      JSON.stringify({ user, token }),
    );
    setUser(user);
    setToken(token);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setToken(null);
    setUser(null);
  };

  const restoreUserSession = async () => {
    const userData = await AsyncStorage.getItem("dt-money-user");
    if (userData) {
      const { token, user } = JSON.parse(userData) as IAuthenticateResponse;
      setUser(user);
      setToken(token);
    }

    return userData;
  };

  const updateUser = async (data: UpdateUserRequest) => {
    try {
      const userUpdated = await userService.updateUser(data);

      if (token) {
        setUser(userUpdated);

        await AsyncStorage.setItem(
          "dt-money-user",
          JSON.stringify({ user: userUpdated, token }),
        );
      }
    } catch (error) {
      throw error;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await userService.deleteUser(id);
      setToken(null);
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        updateUser,
        deleteUser,
        handleAuthenticate,
        handleLogout,
        handleRegister,
        restoreUserSession,
        token,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  return context;
};
