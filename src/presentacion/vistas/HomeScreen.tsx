import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CustomButton } from "../componentes/CustomButton";
import { useAuth } from "../../infrastructura/context/AuthContext";
import { useSolicitudes } from "../../infrastructura/context/SolicitudesContext";

interface HomeScreenProps {
  onNavigateToRegister: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToRegister,
}) => {
  const { state: authState, dispatch: authDispatch } = useAuth(); 
  const { state: solicitudesState } = useSolicitudes();
  const [saludo, setSaludo] = useState("");

  useEffect(() => {
    const hora = new Date().getHours();
    if (hora < 12) {
      setSaludo("¡Buenos días!");
    } else if (hora < 19) {
      setSaludo("¡Buenas tardes!");
    } else {
      setSaludo("¡Buenas noches!");
    }
  }, []);

  const handleCerrarSesion = () => {
    authDispatch({ type: "LOGOUT" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>🚗 AutoFix - Servicio Automotriz</Text>
        <Text style={styles.saludo}>{saludo}</Text>
        <Text style={styles.usuario}>Bienvenido, {authState.usuarioActual}</Text>
      </View>

      <View style={styles.kpiCard}>
        <Text style={styles.kpiLabel}>Vehículos en Registro / Taller</Text>
        <Text style={styles.kpiValue}>{solicitudesState.solicitudes.length}</Text>
        <Text style={styles.kpiSub}>
          Solicitudes activas registradas en memoria
        </Text>
      </View>

      <View style={styles.actions}>
        <Text style={styles.actionsTitle}>Panel de Control</Text>
        <CustomButton
          title="🚘 Registrar Nueva Solicitud"
          onPress={onNavigateToRegister}
        />
        <CustomButton
          title="Cerrar Sesión"
          variant="secondary"
          onPress={handleCerrarSesion}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 40,
  },
  brand: {
    fontSize: 14,
    color: "#ea580c",
    fontWeight: "800",
    textTransform: "uppercase",
  },
  saludo: {
    fontSize: 20,
    color: "#475569",
    marginTop: 6,
    fontWeight: "600",
  },
  usuario: {
    fontSize: 26,
    color: "#0f172a",
    fontWeight: "bold",
  },
  kpiCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 22,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },
  kpiLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  kpiValue: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#ea580c",
    marginVertical: 4,
  },
  kpiSub: {
    fontSize: 12,
    color: "#94a3b8",
  },
  actions: {
    marginBottom: 20,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 10,
  },
});