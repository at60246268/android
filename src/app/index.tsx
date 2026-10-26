import { useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { SolicitudAuto } from "../domain/Solicitud";
import { HomeScreen } from "../presentacion/vistas/HomeScreen";
import { LoginScreen } from "../presentacion/vistas/LoginScreen";
import { RegisterScreen } from "../presentacion/vistas/RegisterScreen";

export default function Index() {
  // Estado de la aplicación
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  // Estado del usuario actual y la pantalla actual
  const [usuarioActual, setUsuarioActual] = useState<string>("");
  const [pantallaActual, setPantallaActual] = useState<"home" | "register">(
    "home",
  );
  // Estado de las solicitudes
  const [solicitudes, setSolicitudes] = useState<SolicitudAuto[]>([]);

  // Funciones para manejar el login, logout y guardar solicitudes
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
    // Configuración de la barra de estado según el estado de login
      <StatusBar barStyle={isLoggedIn ? "dark-content" : "light-content"} />
      {!isLoggedIn ? (
        // Renderiza la pantalla de login si no está logueado
        <LoginScreen onLoginSuccess={handleLogin} />
      ) : pantallaActual === "home" ? (
        // Renderiza la pantalla de inicio si está logueado y en la pantalla de inicio
        <HomeScreen
          usuario={usuarioActual}
          totalSolicitudes={solicitudes.length}
          onNavigateToRegister={() => setPantallaActual("register")}
          onLogout={handleLogout}
        />
      ) : (
        // Renderiza la pantalla de registro si está logueado y en la pantalla de registro
        <RegisterScreen
          onBack={() => setPantallaActual("home")}
          onSave={handleGuardarSolicitud}
        />
      )}
    </SafeAreaView>
  );
}

// Estilos para la aplicación
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
});
