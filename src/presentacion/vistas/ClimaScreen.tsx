import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ClimaActual } from "../../domain/Clima";
import { climaService } from "../../infrastructura/context/services/climaService";
import { CustomButton } from "../componentes/CustomButton";

interface ClimaScreenProps {
  onBack: () => void;
}

export const ClimaScreen: React.FC<ClimaScreenProps> = ({ onBack }) => {
  const [clima, setClima] = useState<ClimaActual | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const consultarClima = async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await climaService.obtenerClimaLima();
      setClima(datos);
    } catch (err: any) {
      setError(err.message || "Error de conexión al consultar la API.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    consultarClima();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clima en Taller (API REST)</Text>
      </View>

      <Text style={styles.subtitle}>
        Consulta en tiempo real para planificación de trabajos en patio y
        recepción de vehículos.
      </Text>

      {cargando && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#EA580C" />
          <Text style={styles.loadingText}>
            Consultando servicio meteorológico...
          </Text>
        </View>
      )}

      {!cargando && error && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!cargando && !error && clima && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="partly-sunny-outline" size={36} color="#EA580C" />
            <View style={styles.cityInfo}>
              <Text style={styles.cityText}>{clima.ciudad}</Text>
              <Text style={styles.descText}>{clima.descripcion}</Text>
            </View>
          </View>

          <Text style={styles.tempText}>{clima.temperatura} °C</Text>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>VIENTO</Text>
              <Text style={styles.detailValue}>
                {clima.velocidadViento} km/h
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>ACTUALIZACIÓN</Text>
              <Text style={styles.detailValue}>{clima.horaActualizacion}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <CustomButton title="Actualizar Clima (GET)" onPress={consultarClima} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F17",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
    backgroundColor: "#1E293B",
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 13,
    color: "#94A3B8",
    marginBottom: 24,
  },
  centerBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    color: "#CBD5E1",
    marginTop: 12,
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: "#1E1B1E",
    borderColor: "#EF4444",
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  errorText: {
    color: "#FCA5A5",
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1F2937",
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cityInfo: {
    marginLeft: 14,
  },
  cityText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  descText: {
    color: "#EA580C",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  tempText: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "800",
    marginVertical: 10,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    paddingTop: 16,
    marginTop: 10,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
  },
  detailValue: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    marginTop: "auto",
  },
});
