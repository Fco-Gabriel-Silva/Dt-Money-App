import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

export type SnackbarMessageType = "ERROR" | "SUCCESS";

interface NotifyMessageParams {
  message: string;
  messageType: SnackbarMessageType;
}

export type SnackBarContextType = {
  message: string | null;
  type: SnackbarMessageType | null;
  notify: (params: NotifyMessageParams) => void;
};

export const SnackbarContext = createContext({} as SnackBarContextType);

export const SnackbarContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<SnackbarMessageType | null>(null);

  const notify = ({
    message: newMessage,
    messageType,
  }: NotifyMessageParams) => {
    setMessage(newMessage);
    setType(messageType);
    setTimeout(() => {
      setMessage(null);
      setType(null);
    }, 3000);
  };

  return (
    <SnackbarContext.Provider
      value={{
        notify,
        type,
        message,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbarContext = () => {
  const context = useContext(SnackbarContext);
  return context;
};
