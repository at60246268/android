import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SolicitudAuto, EstadoAuto } from '../../domain/Solicitud';
import { useSolicitudes } from '../../infrastructura/context/SolicitudesContext';
import { CustomButton } from '../componentes/CustomButton';

interface Props {
  solicitud: SolicitudAuto;
  onBack: () => void;
  onEdit: (item: SolicitudAuto) => void;
}

export const SolicitudDetailScreen: React.FC<Props> = ({ solicitud, onBack, onEdit }) => {
  const { cambiarEstado, eliminarSolicitud } = useSolicitudes();

  const handleEliminar = () => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Está seguro de eliminar la solicitud de la placa ${solicitud.vehiculoPlaca}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            eliminarSolicitud(solicitud.id);
            Alert.alert('Eliminado', 'Solicitud eliminada correctamente.');
            onBack();
          },
        },
      ]
    );
  };

  const handleEstado = (nuevoEstado: EstadoAuto) => {
    cambiarEstado(solicitud.id, nuevoEstado);
    Alert.alert('Estado Actualizado', `La solicitud pasó a: ${nuevoEstado}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalle de Solicitud</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Placa del Vehículo:</Text>
        <Text style={styles.valueHighlight}>{solicitud.vehiculoPlaca}</Text>

        <Text style={styles.label}>Modelo / Marca:</Text>
        <Text style={styles.value}>{solicitud.vehiculoModelo}</Text>

        <Text style={styles.label}>Cliente:</Text>
        <Text style={styles.value}>{solicitud.clienteNombre} ({solicitud.telefono})</Text>

        <Text style={styles.label}>Tipo de Servicio:</Text>
        <Text style={styles.value}>{solicitud.tipoServicio}</Text>

        <Text style={styles.label}>Prioridad:</Text>
        <Text style={styles.value}>{solicitud.prioridad}</Text>

        <Text style={styles.label}>Estado Actual:</Text>
        <Text style={styles.valueStatus}>{solicitud.estado}</Text>

        <Text style={styles.label}>Descripción de la Falla:</Text>
        <Text style={styles.valueDesc}>{solicitud.descripcion}</Text>
      </View>

      <Text style={styles.sectionTitle}>Cambiar Estado Rápido:</Text>
      <View style={styles.btnRow}>
        <CustomButton title="Pendiente" variant="secondary" onPress={() => handleEstado('PENDIENTE')} />
        <CustomButton title="En Proceso" onPress={() => handleEstado('EN_PROCESO')} />
        <CustomButton title="Finalizado" onPress={() => handleEstado('FINALIZADO')} />
      </View>

      <View style={styles.actions}>
        <CustomButton title="✏️ Editar Datos" onPress={() => onEdit(solicitud)} />
        <CustomButton title="🗑️ Eliminar Registro" variant="secondary" onPress={handleEliminar} />
        <CustomButton title="Volver a la Lista" variant="secondary" onPress={onBack} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 40, backgroundColor: '#ffffff', flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 16 },
  card: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '700', color: '#64748b', marginTop: 8 },
  value: { fontSize: 16, color: '#0f172a', fontWeight: '500' },
  valueHighlight: { fontSize: 22, fontWeight: 'bold', color: '#ea580c' },
  valueStatus: { fontSize: 16, fontWeight: 'bold', color: '#2563eb' },
  valueDesc: { fontSize: 14, color: '#334155', fontStyle: 'italic', marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 8 },
  btnRow: { gap: 8, marginBottom: 20 },
  actions: { gap: 10, marginBottom: 30 },
});