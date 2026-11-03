import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SolicitudAuto } from '../../domain/Solicitud';

interface SolicitudCardProps {
  item: SolicitudAuto;
  onPress: () => void;
}

export const SolicitudCard: React.FC<SolicitudCardProps> = ({ item, onPress }) => {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return { bg: '#fef3c7', text: '#d97706' };
      case 'EN_PROCESO': return { bg: '#dbeafe', text: '#2563eb' };
      case 'FINALIZADO': return { bg: '#dcfce7', text: '#16a34a' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Urgente': return { bg: '#fee2e2', text: '#dc2626' };
      case 'Media': return { bg: '#ffedd5', text: '#ea580c' };
      default: return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  const estadoStyle = getEstadoColor(item.estado);
  const prioridadStyle = getPrioridadColor(item.prioridad);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.placa}>{item.vehiculoPlaca}</Text>
        <View style={styles.badges}>
          <View style={[styles.chip, { backgroundColor: prioridadStyle.bg }]}>
            <Text style={[styles.chipText, { color: prioridadStyle.text }]}>{item.prioridad}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: estadoStyle.bg }]}>
            <Text style={[styles.chipText, { color: estadoStyle.text }]}>{item.estado}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.modelo}>{item.vehiculoModelo}</Text>
      <Text style={styles.servicio}>🔧 {item.tipoServicio}</Text>
      <Text style={styles.cliente}>👤 {item.clienteNombre} ({item.telefono})</Text>

      <Text style={styles.fecha}>Registrado: {item.fechaRegistro}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  placa: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ea580c',
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modelo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  servicio: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 2,
  },
  cliente: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 6,
  },
  fecha: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'right',
  },
});