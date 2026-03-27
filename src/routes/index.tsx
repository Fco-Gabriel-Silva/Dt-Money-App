import { NavigationContainer } from "@react-navigation/native";
import { PublicRoutes } from "./PublicRoutes";
import { useCallback, useState } from "react";
import { PrivateRoutes } from "./PrivateRoutes";
import { SystemBars } from "react-native-edge-to-edge";
import { useAuthContext } from "@/context/auth.context";
import { Loading } from "@/screens/Loading";

const NavigationRoutes = () => {
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuthContext();

  if (loading) {
    return <Loading setLoading={setLoading} />;
  }

  return (
    <NavigationContainer>
      <SystemBars style={"light"} />
      {!user || !token ? <PublicRoutes /> : <PrivateRoutes />}
    </NavigationContainer>
  );
};

export default NavigationRoutes;
