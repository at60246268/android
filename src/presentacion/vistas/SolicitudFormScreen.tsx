import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { CustomInput } from '../componentes/CustomInput';
import { CustomButton } from '../componentes/CustomButton';
import { useSolicitudes } from '../../infrastructura/context/SolicitudesContext';
import { SolicitudAuto, TipoServicioAuto, PrioridadAuto } from '../../domain/Solicitud';

interface Props {
  onBack: () => void;
  solicitudAEditar?: SolicitudAuto | null;
}

export const SolicitudFormScreen: React.FC<Props> = ({ onBack, solicitudAEditar }) => {
  const { agregarSolicitud, actualizarSolicitud } = useSolicitudes();

  const [clienteNombre, setClienteNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [vehiculoPlaca, setVehiculoPlaca] = useState('');
  const [vehiculoModelo, setVehiculoModelo] = useState('');
  const [tipoServicio, setTipoServicio] = useState<TipoServicioAuto>('Mantenimiento Preventivo');
  const [prioridad, setPrioridad] = useState<PrioridadAuto>('Media');
  const [descripcion, setDescripcion] = useState('');

  const [errores, setErrores] = useState<{
    clienteNombre?: string;
    telefono?: string;
    vehiculoPlaca?: string;
    descripcion?: string;
  }>({});

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (solicitudAEditar) {
      setClienteNombre(solicitudAEditar.clienteNombre);
      setTelefono(solicitudAEditar.telefono);
      setVehiculoPlaca(solicitudAEditar.vehiculoPlaca);
      setVehiculoModelo(solicitudAEditar.vehiculoModelo);
      setTipoServicio(solicitudAEditar.tipoServicio);
      setPrioridad(solicitudAEditar.prioridad);
      setDescripcion(solicitudAEditar.descripcion);
    }
  }, [solicitudAEditar]);

  const validar = (): boolean => {
    const err: typeof errores = {};

    if (!clienteNombre.trim()) {
      err.clienteNombre = 'El nombre del cliente es obligatorio.';
    }
    if (!telefono.trim()) {
      err.telefono = 'El teléfono de contacto es obligatorio.';
    } else if (telefono.trim().length < 9) {
      err.telefono = 'Ingrese un número válido (mínimo 9 dígitos).';
    }
    if (!vehiculoPlaca.trim()) {
      err.vehiculoPlaca = 'La placa del vehículo es obligatoria.';
    }
    if (!descripcion.trim()) {
      err.descripcion = 'La descripción de la falla o trabajo es obligatoria.';
    }

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleGuardar = () => {
    if (!validar()) return;

    if (solicitudAEditar) {
      const solicitudActualizada: SolicitudAuto = {
        ...solicitudAEditar,
        clienteNombre: clienteNombre.trim(),
        telefono: telefono.trim(),
        vehiculoPlaca: vehiculoPlaca.trim().toUpperCase(),
        vehiculoModelo: vehiculoModelo.trim() || 'No especificado',
        tipoServicio,
        prioridad,
        descripcion: descripcion.trim(),
      };
      actualizarSolicitud(solicitudActualizada);
      Alert.alert('Éxito', 'Solicitud actualizada correctamente en el sistema.');
    } else {
      const nuevaSolicitud: SolicitudAuto = {
        id: Date.now().toString(),
        clienteNombre: clienteNombre.trim(),
        telefono: telefono.trim(),
        vehiculoPlaca: vehiculoPlaca.trim().toUpperCase(),
        vehiculoModelo: vehiculoModelo.trim() || 'No especificado',
        tipoServicio,
        prioridad,
        descripcion: descripcion.trim(),
        estado: 'PENDIENTE',
        fechaRegistro: new Date().toLocaleDateString(),
      };
      agregarSolicitud(nuevaSolicitud);
      Alert.alert('Éxito', 'Nueva solicitud registrada correctamente en el taller.');
    }

    onBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {solicitudAEditar ? '✏️ Editar Solicitud' : '🚘 Nueva Solicitud'}
        </Text>
        <Text style={styles.subtitle}>
          {solicitudAEditar
            ? 'Modifique los datos del registro técnico'
            : 'Ingrese los datos del cliente y vehículo a taller'}
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
          placeholder="Ej. Toyota Corolla 2021"
          value={vehiculoModelo}
          onChangeText={setVehiculoModelo}
        />

        <CustomInput
          label="Tipo de Solicitud / Servicio *"
          placeholder="Ej. Mantenimiento Preventivo, Frenos, Motor..."
          value={tipoServicio}
          onChangeText={(txt) => setTipoServicio(txt as TipoServicioAuto)}
        />

        <CustomInput
          label="Prioridad *"
          placeholder="Ej. Baja, Media, Urgente"
          value={prioridad}
          onChangeText={(txt) => setPrioridad(txt as PrioridadAuto)}
        />

        <CustomInput
          label="Descripción de la Falla o Trabajo *"
          placeholder="Describa los síntomas o requerimiento del cliente..."
          multiline
          numberOfLines={3}
          value={descripcion}
          onChangeText={setDescripcion}
          error={errores.descripcion}
        />

        <View style={styles.actions}>
          <CustomButton
            title={solicitudAEditar ? 'Guardar Cambios' : 'Registrar Solicitud'}
            onPress={handleGuardar}
          />
          <CustomButton title="Cancelar" variant="secondary" onPress={onBack} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: { flex: 1, backgroundColor: '#ffffff' },
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#ffffff',
    flexGrow: 1,
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
  actions: {
    marginTop: 10,
    marginBottom: 30,
    gap: 8,
  },
});