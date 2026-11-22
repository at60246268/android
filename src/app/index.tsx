import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import { AuthProvider, useAuth } from "../infrastructura/context/AuthContext";
import { inicializarBaseDatos } from "../infrastructura/context/database/database";
import { SolicitudesProvider } from "../infrastructura/context/SolicitudesContext";

import { ClimaScreen } from "../presentacion/vistas/ClimaScreen";
import { HomeScreen } from "../presentacion/vistas/HomeScreen";
import { LoginScreen } from "../presentacion/vistas/LoginScreen";
import { RegisterUserScreen } from "../presentacion/vistas/RegisterUserScreen";
import { SolicitudDetailScreen } from "../presentacion/vistas/SolicitudDetailScreen";
import { SolicitudesListScreen } from "../presentacion/vistas/SolicitudesListScreen";
import { SolicitudFormScreen } from "../presentacion/vistas/SolicitudFormScreen";

import { SolicitudAuto } from "../domain/Solicitud";

// Definición del tipo de vista que puede tener la aplicación
type Vista = "home" | "list" | "create" | "detail" | "registerUser" | "clima";

// Componente que maneja la navegación entre las diferentes vistas de la aplicación
function AppNavigation() {
  const { state: authState, dispatch: dispatchAuth } = useAuth();
  const [vistaActual, setVistaActual] = useState<Vista>("home");
  const [historial, setHistorial] = useState<Vista[]>([]);
  const [solicitudSeleccionada, setSolicitudSeleccionada] =
    useState<SolicitudAuto | null>(null);

  // Verifica si el usuario tiene una sesión válida (está logueado y tiene un token de acceso)
  const tieneSesionValida =
    authState.isLoggedIn && Boolean(authState.accessToken);

  // Función para navegar a una vista específica y agregar la vista actual al historial de navegación
  const navegarA = (vista: Vista) => {
    setHistorial((anterior) => [...anterior, vistaActual]);
    setVistaActual(vista);
  };

  // Función para volver a la vista anterior en el historial de navegación
  const volver = () => {
    const vistaAnterior = historial[historial.length - 1] ?? "home";
    setHistorial((anterior) => anterior.slice(0, -1));
    setVistaActual(vistaAnterior);
  };

  // Función para cerrar sesión, limpiar el historial y volver a la vista de inicio
  const cerrarSesion = () => {
    setHistorial([]);
    setVistaActual("home");
    dispatchAuth({ type: "LOGOUT" });
  };

  // Renderizar las vistas de autenticación si el usuario no tiene sesión válida
  if (!tieneSesionValida) {
    if (vistaActual === "registerUser") {
      return <RegisterUserScreen onBackToLogin={volver} />;
    }
    return (
      <LoginScreen
        onLoginSuccess={() => {
          setHistorial([]);
          setVistaActual("home");
        }}
        onNavigateToRegisterUser={() => navegarA("registerUser")}
      />
    );
  }
  
  // Renderizar las vistas principales de la aplicación cuando el usuario tiene sesión válida
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {vistaActual === "home" && (
        <HomeScreen
          onNavigateToList={() => navegarA("list")}
          onNavigateToRegister={() => {
            setSolicitudSeleccionada(null);
            navegarA("create");
          }}
          onNavigateToClima={() => navegarA("clima")}
          onLogout={cerrarSesion}
        />
      )}

      {vistaActual === "list" && (
        <SolicitudesListScreen
          onBack={volver}
          onNewSolicitud={() => {
            setSolicitudSeleccionada(null);
            navegarA("create");
          }}
          onSelectSolicitud={(item) => {
            setSolicitudSeleccionada(item);
            navegarA("detail");
          }}
        />
      )}

      {vistaActual === "create" && (
        <SolicitudFormScreen
          solicitudAEditar={solicitudSeleccionada}
          onBack={volver}
        />
      )}

      {vistaActual === "detail" && solicitudSeleccionada && (
        <SolicitudDetailScreen
          solicitud={solicitudSeleccionada}
          onBack={volver}
          onEdit={(item) => {
            setSolicitudSeleccionada(item);
            navegarA("create");
          }}
        />
      )}

      {vistaActual === "clima" && <ClimaScreen onBack={volver} />}
    </SafeAreaView>
  );
}

// Componente principal de la aplicación que envuelve la navegación y los proveedores de contexto
export default function Index() {
  return (
    <SQLiteProvider
      databaseName="autofix_local.db"
      onInit={inicializarBaseDatos}
    >
      <AuthProvider>
        <SolicitudesProvider>
          <AppNavigation />
        </SolicitudesProvider>
      </AuthProvider>
    </SQLiteProvider>
  );
}

// Estilos para el contenedor principal de la aplicación
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F17",
  },
});
