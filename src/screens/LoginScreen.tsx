import React, { useState } from "react";
<<<<<<< HEAD
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
=======
import {KeyboardAvoidingView, Platform, StyleSheet, Text, View} from "react-native";
>>>>>>> main
import { CustomButton } from "../components/CustomButton";
import { CustomInput } from "../components/CustomInput";

interface LoginScreenProps {
<<<<<<< HEAD
  onLoginSuccess: (usuario: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
=======
  onLoginSuccess: (usuario: string) => void; //Función que se ejecuta cuando el usuario inicia sesión correctamente
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {

  // Estados para manejar los campos de usuario, contraseña y errores
>>>>>>> main
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState<{
    usuario?: string;
    password?: string;
  }>({});

  const handleIngresar = () => {
    const err: { usuario?: string; password?: string } = {};

<<<<<<< HEAD
=======
    // Validación de campos vacíos
>>>>>>> main
    if (!usuario.trim()) {
      err.usuario = "El campo usuario es obligatorio.";
    }
    if (!password.trim()) {
      err.password = "El campo contraseña es obligatorio.";
    }

    if (Object.keys(err).length > 0) {
      setErrores(err);
      return;
    }

    setErrores({});
    onLoginSuccess(usuario);
  };

  return (
<<<<<<< HEAD
=======

    // KeyboardAvoidingView para manejar el teclado en dispositivos móviles
>>>>>>> main
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
<<<<<<< HEAD
=======
    // Vista principal que contiene la tarjeta de inicio de sesión
>>>>>>> main
      <View style={styles.card}>
        <Text style={styles.brand}> AutoFix Manager</Text>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}>Gestión de Solicitudes y Taller</Text>
<<<<<<< HEAD

=======
    // Componente personalizado para el usuario
>>>>>>> main
        <CustomInput
          label="Usuario / Técnico"
          placeholder="Ej. mecanico01"
          value={usuario}
          onChangeText={setUsuario}
          error={errores.usuario}
          autoCapitalize="none"
        />
<<<<<<< HEAD

=======
    // Componente personalizado para la contraseña
>>>>>>> main
        <CustomInput
          label="Contraseña"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errores.password}
        />
<<<<<<< HEAD

=======
    // Botón personalizado para ingresar al sistema
>>>>>>> main
        <View style={styles.btnWrapper}>
          <CustomButton title="Ingresar al Sistema" onPress={handleIngresar} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

<<<<<<< HEAD
=======
// Estilos para los componentes de la pantalla de inicio de sesión
>>>>>>> main
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    elevation: 5,
  },
  brand: {
    color: "#ea580c",
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
  },
  btnWrapper: {
    marginTop: 10,
  },
});
