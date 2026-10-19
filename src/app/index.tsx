import { useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { SolicitudAuto } from "../models/Solicitud";
import { HomeScreen } from "../screens/HomeScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [usuarioActual, setUsuarioActual] = useState<string>("");
  const [pantallaActual, setPantallaActual] = useState<"home" | "register">(
    "home",
  );
  const [solicitudes, setSolicitudes] = useState<SolicitudAuto[]>([]);

  const handleLogin = (user: string) => {
    setUsuarioActual(user);
    setIsLoggedIn(true);
    setPantallaActual("home");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsuarioActual("");
    setPantallaActual("home");
  };

  const handleGuardarSolicitud = (nueva: SolicitudAuto) => {
    setSolicitudes((prev) => [nueva, ...prev]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isLoggedIn ? "dark-content" : "light-content"} />
      {!isLoggedIn ? (
        <LoginScreen onLoginSuccess={handleLogin} />
      ) : pantallaActual === "home" ? (
        <HomeScreen
          usuario={usuarioActual}
          totalSolicitudes={solicitudes.length}
          onNavigateToRegister={() => setPantallaActual("register")}
          onLogout={handleLogout}
        />
      ) : (
        <RegisterScreen
          onBack={() => setPantallaActual("home")}
          onSave={handleGuardarSolicitud}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
});
