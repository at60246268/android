import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { CustomInput } from '../componentes/CustomInput';
import { CustomButton } from '../componentes/CustomButton';

// 1. Agregar la propiedad opcional u obligatoria a las Props
interface LoginScreenProps {
  onLoginSuccess: (usuario: string) => void;
  onNavigateToRegisterUser?: () => void; // <--- Agregado aquí
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToRegisterUser,
}) => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState<{ usuario?: string; password?: string }>({});

  const handleIngresar = () => {
    const err: { usuario?: string; password?: string } = {};

    if (!usuario.trim()) {
      err.usuario = 'El campo usuario es obligatorio.';
    }
    if (!password.trim()) {
      err.password = 'El campo contraseña es obligatorio.';
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
<<<<<<< HEAD
        <Text style={styles.brand}> AutoFix Manager</Text>
=======
        <Text style={styles.brand}>🔧 AutoFix Manager</Text>
>>>>>>> main
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
          
          {/* Botón/Enlace opcional para ir al Registro de Nuevo Usuario */}
          {onNavigateToRegisterUser && (
            <TouchableOpacity onPress={onNavigateToRegisterUser} style={styles.registerLink}>
              <Text style={styles.registerText}>¿No tienes cuenta? Regístrate aquí</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    elevation: 5,
  },
  brand: {
    color: '#ea580c',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  btnWrapper: {
    marginTop: 10,
    gap: 12,
  },
  registerLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  registerText: {
    color: '#ea580c',
    fontSize: 14,
    fontWeight: '600',
  },
});