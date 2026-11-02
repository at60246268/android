import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, ScrollView, Alert,} from "react-native";
import { CustomButton } from "../componentes/CustomButton";
import { CustomInput } from "../componentes/CustomInput";

interface RegisterUserScreenProps {
  onBackToLogin: () => void;
  onRegisterSuccess: (usuario: string) => void;
}

export const RegisterUserScreen: React.FC<RegisterUserScreenProps> = ({
  onBackToLogin,
  onRegisterSuccess,
}) => {
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errores, setErrores] = useState<{
    nombre?: string;
    usuario?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleRegistrar = () => {
    const err: typeof errores = {};

    if (!nombre.trim()) {
      err.nombre = "El nombre es obligatorio.";
    }
    if (!usuario.trim()) {
      err.usuario = "El usuario es obligatorio.";
    }
    if (!password.trim()) {
      err.password = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
      err.password = "Debe tener al menos 6 caracteres.";
    }
    if (password !== confirmPassword) {
      err.confirmPassword = "Las contraseñas no coinciden.";
    }

    if (Object.keys(err).length > 0) {
      setErrores(err);
      return;
    }

    setErrores({});
    Alert.alert("Éxito", "Cuenta creada correctamente.");
    onRegisterSuccess(usuario);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.brand}>AutoFix Manager</Text>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Regístrate como nuevo usuario</Text>

          <CustomInput
            label="Nombre Completo"
            placeholder="Ej. Carlos Mendoza"
            value={nombre}
            onChangeText={setNombre}
            error={errores.nombre}
          />

          <CustomInput
            label="Nombre de Usuario"
            placeholder="Ej. cmendoza"
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

          <CustomInput
            label="Confirmar Contraseña"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errores.confirmPassword}
          />

          <View style={styles.btnWrapper}>
            <CustomButton title="Registrarse" onPress={handleRegistrar} />
            <CustomButton title="Volver al Login" variant="secondary" onPress={onBackToLogin} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  scrollContainer: {
    flexGrow: 1,
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
    gap: 8,
  },
});