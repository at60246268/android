import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useSolicitudes } from '../../infrastructura/context/SolicitudesContext';
import { SolicitudCard } from '../componentes/SolicitudCard';
import { CustomButton } from '../componentes/CustomButton';
import { SolicitudAuto } from '../../domain/Solicitud';

interface Props {
  onBack: () => void;
  onSelectSolicitud: (item: SolicitudAuto) => void;
  onNewSolicitud: () => void;
}

export const SolicitudesListScreen: React.FC<Props> = ({ onBack, onSelectSolicitud, onNewSolicitud }) => {
  const { solicitudes } = useSolicitudes();
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');

  const solicitudesFiltradas = solicitudes.filter((s) => {
    const coincideTexto =
      s.vehiculoPlaca.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.tipoServicio.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado = filtroEstado === 'TODOS' || s.estado === filtroEstado;

    return coincideTexto && coincideEstado;
  });

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Solicitudes en Taller</Text>
      </View>

      {/* Buscador */}
      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Buscar por placa, cliente o servicio..."
        value={busqueda}
        onChangeText={setBusqueda}
      />

      {/* Filtros por Estado */}
      <View style={styles.filtersContainer}>
        {['TODOS', 'PENDIENTE', 'EN_PROCESO', 'FINALIZADO'].map((estado) => (
          <TouchableOpacity
            key={estado}
            style={[styles.filterChip, filtroEstado === estado && styles.filterChipActive]}
            onPress={() => setFiltroEstado(estado)}
          >
            <Text style={[styles.filterText, filtroEstado === estado && styles.filterTextActive]}>
              {estado}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista con FlatList */}
      <FlatList
        data={solicitudesFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SolicitudCard item={item} onPress={() => onSelectSolicitud(item)} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron solicitudes.</Text>
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <View style={styles.fabContainer}>
        <CustomButton title="➕ Nueva Solicitud" onPress={onNewSolicitud} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16, paddingTop: 40 },
  topHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  backText: { fontSize: 16, color: '#ea580c', fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  searchBar: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  filtersContainer: { flexDirection: 'row', gap: 6, marginBottom: 14 },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
  },
  filterChipActive: { backgroundColor: '#ea580c' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  filterTextActive: { color: '#ffffff' },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 40, fontSize: 14 },
  fabContainer: { position: 'absolute', bottom: 20, left: 16, right: 16 },
});