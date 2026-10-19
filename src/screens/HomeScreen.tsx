import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CustomButton } from "../components/CustomButton";

<<<<<<< HEAD
//Definición de las propiedades (props) que recibe la pantalla
=======
>>>>>>> main
interface HomeScreenProps {
  usuario: string;
  totalSolicitudes: number;
  onNavigateToRegister: () => void;
  onLogout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  usuario,
  totalSolicitudes,
  onNavigateToRegister,
  onLogout,
}) => {
<<<<<<< HEAD
  // Estado local para almacenar el saludo dinámico según la hora
=======
>>>>>>> main
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}> AutoFix - Servicio Automotriz</Text>
        <Text style={styles.saludo}>{saludo}</Text>
        <Text style={styles.usuario}>Bienvenido, {usuario}</Text>
      </View>

      <View style={styles.kpiCard}>
        <Text style={styles.kpiLabel}>Vehículos en Registro / Taller</Text>
        <Text style={styles.kpiValue}>{totalSolicitudes}</Text>
        <Text style={styles.kpiSub}>
          Solicitudes activas registradas en memoria
        </Text>
      </View>

      <View style={styles.actions}>
        <Text style={styles.actionsTitle}>Panel de Control</Text>
        <CustomButton
          title=" Registrar Nueva Solicitud"
          onPress={onNavigateToRegister}
        />
        <CustomButton
          title="Cerrar Sesión"
          variant="secondary"
          onPress={onLogout}
        />
      </View>
    </View>
  );
};
<<<<<<< HEAD
// Estilos visuales de la pantalla organizados por componentes
=======

>>>>>>> main
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
<<<<<<< HEAD
    justifyContent: "space-between", // Distribuye los bloques verticalmente
=======
    justifyContent: "space-between",
>>>>>>> main
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
<<<<<<< HEAD
    elevation: 2, // Sombra para dispositivos Android
=======
    elevation: 2,
>>>>>>> main
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
