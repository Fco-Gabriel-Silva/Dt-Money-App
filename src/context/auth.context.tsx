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
import { IAuthenticateResponse } from "@/shared/interfaces/https/authenticate-response";
import { UpdateUserRequest } from "@/shared/interfaces/https/update-user-request";
import { Alert } from "react-native";
import { database } from "@/databases";
import { hasUnsyncedChanges } from "@nozbe/watermelondb/sync";
import * as SecureStore from "expo-secure-store";
import { dtMoneyApi } from "@/shared/api/dt-money";

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

    // Usa o SecureStore no lugar do AsyncStorage
    await SecureStore.setItemAsync(
      "dt-money-user",
      JSON.stringify({ user, token }),
    );

    dtMoneyApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
    setToken(token);
  };

  const handleRegister = async (formData: FormRegisterParams) => {
    const { token, user } = await authService.registerUser(formData);

    // Usa o SecureStore no lugar do AsyncStorage
    await SecureStore.setItemAsync(
      "dt-money-user",
      JSON.stringify({ user, token }),
    );

    dtMoneyApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
    setToken(token);
  };

  const handleLogout = async () => {
    try {
      const hasPendingChanges = await hasUnsyncedChanges({ database });

      if (hasPendingChanges) {
        Alert.alert(
          "Atenção: Sincronização Pendente",
          "Você possui transações ou categorias criadas offline que ainda não foram salvas no servidor. Conecte-se à internet e aguarde a sincronização antes de sair para não perder seus dados.",
          [{ text: "Entendi" }],
        );
        return;
      }

      await database.write(async () => {
        await database.unsafeResetDatabase();
      });

      // Deleta a chave específica do cofre
      await SecureStore.deleteItemAsync("dt-money-user");

      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    }
  };

  const restoreUserSession = async () => {
    // Lê os dados criptografados do cofre
    const userData = await SecureStore.getItemAsync("dt-money-user");

    if (userData) {
      const { token, user } = JSON.parse(userData) as IAuthenticateResponse;

      // Essencial: Injeta o token na API ao restaurar a sessão!
      dtMoneyApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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

        await SecureStore.setItemAsync(
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

      // Limpa os dados de acesso do cofre
      await SecureStore.deleteItemAsync("dt-money-user");
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
