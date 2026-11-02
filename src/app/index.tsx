import { useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { AuthProvider, useAuth } from "../infrastructura/context/AuthContext";
import { HomeScreen } from "../presentacion/vistas/HomeScreen";
import { LoginScreen } from "../presentacion/vistas/LoginScreen";
import { RegisterScreen } from "../presentacion/vistas/RegisterScreen";
import { RegisterUserScreen } from "../presentacion/vistas/RegisterUserScreen";

function AppNavigator() {
  const { state } = useAuth();
  const [pantallaAuth, setPantallaAuth] = useState<"login" | "register-user">("login");
  const [pantallaActual, setPantallaActual] = useState<"home" | "register">("home");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={state.isLoggedIn ? "dark-content" : "light-content"} />

      {!state.isLoggedIn ? (
        pantallaAuth === "register-user" ? (
          <RegisterUserScreen
            onBackToLogin={() => setPantallaAuth("login")}
          />
        ) : (
          <LoginScreen
            onNavigateToRegisterUser={() => setPantallaAuth("register-user")}
          />
        )
      ) : (

        pantallaActual === "home" ? (
          <HomeScreen
            onNavigateToRegister={() => setPantallaActual("register")}
          />
        ) : (
          <RegisterScreen
            onBack={() => setPantallaActual("home")}
          />
        )
      )}
    </SafeAreaView>
  );
}

export default function Index() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
});
