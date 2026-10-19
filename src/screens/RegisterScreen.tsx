import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { CustomButton } from "../components/CustomButton";
import { CustomInput } from "../components/CustomInput";
import { SolicitudAuto, TipoServicioAuto } from "../models/Solicitud";

interface RegisterScreenProps {
  onBack: () => void;
  onSave: (solicitud: SolicitudAuto) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onBack,
  onSave,
}) => {
  const [clienteNombre, setClienteNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [vehiculoPlaca, setVehiculoPlaca] = useState("");
  const [vehiculoModelo, setVehiculoModelo] = useState("");
  const [tipoServicio, setTipoServicio] = useState<TipoServicioAuto>(
    "Mantenimiento Preventivo",
  );
  const [descripcion, setDescripcion] = useState("");

  const [errores, setErrores] = useState<{
    clienteNombre?: string;
    telefono?: string;
    vehiculoPlaca?: string;
    descripcion?: string;
  }>({});

  const validar = (): boolean => {
    const err: typeof errores = {};

    if (!clienteNombre.trim()) {
      err.clienteNombre = "El nombre del cliente es obligatorio.";
    }
    if (!telefono.trim()) {
      err.telefono = "El teléfono de contacto es obligatorio.";
    } else if (telefono.trim().length < 9) {
      err.telefono = "Ingrese un número válido (mínimo 9 dígitos).";
    }
    if (!vehiculoPlaca.trim()) {
      err.vehiculoPlaca = "La placa del vehículo es obligatoria.";
    }
    if (!descripcion.trim()) {
      err.descripcion = "La descripción del requerimiento es obligatoria.";
    }

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleGuardar = () => {
    if (!validar()) return;

    const nuevaSolicitud: SolicitudAuto = {
      id: Date.now().toString(),
      clienteNombre,
      telefono,
      vehiculoPlaca: vehiculoPlaca.toUpperCase(),
      vehiculoModelo: vehiculoModelo || "No especificado",
      tipoServicio,
      prioridad: "Media",
      descripcion,
      estado: "Pendiente",
      fechaRegistro: new Date().toLocaleDateString(),
    };

    onSave(nuevaSolicitud);
    Alert.alert("Éxito", "Solicitud registrada correctamente en el taller.");
    onBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar Entrada a Taller</Text>
      <Text style={styles.subtitle}>
        Complete los datos del vehículo y cliente
      </Text>

      <CustomInput
        label="Nombre del Cliente *"
        placeholder="Ej. Carlos Mendoza"
        value={clienteNombre}
        onChangeText={setClienteNombre}
        error={errores.clienteNombre}
      />

      <CustomInput
        label="Teléfono de Contacto *"
        placeholder="Ej. 987654321"
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
        error={errores.telefono}
      />

      <CustomInput
        label="Placa del Vehículo *"
        placeholder="Ej. ABC-123"
        autoCapitalize="characters"
        value={vehiculoPlaca}
        onChangeText={setVehiculoPlaca}
        error={errores.vehiculoPlaca}
      />

      <CustomInput
        label="Modelo / Marca del Auto"
        placeholder="Ej. Toyota Corolla 2020"
        value={vehiculoModelo}
        onChangeText={setVehiculoModelo}
      />

      <CustomInput
        label="Tipo de Solicitud / Servicio *"
        placeholder="Ej. Mantenimiento Preventivo / Frenos"
        value={tipoServicio}
        onChangeText={(txt) => setTipoServicio(txt as TipoServicioAuto)}
      />

      <CustomInput
        label="Descripción de la Falla *"
        placeholder="Describa el trabajo o síntoma presentado..."
        multiline
        numberOfLines={3}
        value={descripcion}
        onChangeText={setDescripcion}
        error={errores.descripcion}
      />

      <View style={styles.actions}>
        <CustomButton title="Guardar Solicitud" onPress={handleGuardar} />
        <CustomButton title="Cancelar" variant="secondary" onPress={onBack} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    flexGrow: 1,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
  },
  actions: {
    marginTop: 10,
    marginBottom: 30,
  },
});
