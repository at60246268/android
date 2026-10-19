import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { CustomButton } from "../components/CustomButton";
import { CustomInput } from "../components/CustomInput";

interface LoginScreenProps {
  onLoginSuccess: (usuario: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState<{
    usuario?: string;
    password?: string;
  }>({});

  const handleIngresar = () => {
    const err: { usuario?: string; password?: string } = {};

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.brand}> AutoFix Manager</Text>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}>Gestión de Solicitudes y Taller</Text>

        <CustomInput
          label="Usuario / Técnico"
          placeholder="Ej. mecanico01"
          value={usuario}
          onChangeText={setUsuario}
          error={errores.usuario}
          autoCapitalize="none"
        />

        <CustomInput
          label="Contraseña"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errores.password}
        />

        <View style={styles.btnWrapper}>
          <CustomButton title="Ingresar al Sistema" onPress={handleIngresar} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

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
