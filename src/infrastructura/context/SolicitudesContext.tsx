import React, { createContext, useContext, useReducer } from 'react';
import { SolicitudAuto, EstadoAuto } from '../../domain/Solicitud';

type State = {
  solicitudes: SolicitudAuto[];
};

type Action =
  | { type: 'ADD_SOLICITUD'; payload: SolicitudAuto }
  | { type: 'UPDATE_SOLICITUD'; payload: SolicitudAuto }
  | { type: 'CHANGE_ESTADO'; payload: { id: string; nuevoEstado: EstadoAuto } }
  | { type: 'DELETE_SOLICITUD'; payload: string };

const solicitudesIniciales: SolicitudAuto[] = [
  {
    id: '1',
    clienteNombre: 'Carlos Mendoza',
    telefono: '987654321',
    vehiculoPlaca: 'ABC-123',
    vehiculoModelo: 'Toyota Corolla 2021',
    tipoServicio: 'Mantenimiento Preventivo',
    prioridad: 'Media',
    descripcion: 'Cambio de aceite, filtro y revisión de fluidos generales.',
    estado: 'PENDIENTE',
    fechaRegistro: '02/11/2026',
  },
  {
    id: '2',
    clienteNombre: 'Ana Torres',
    telefono: '912345678',
    vehiculoPlaca: 'XYZ-789',
    vehiculoModelo: 'Nissan Sentra 2019',
    tipoServicio: 'Sistema de Frenos',
    prioridad: 'Urgente',
    descripcion: 'Chirrido agudo al frenar y pedal esponjoso.',
    estado: 'EN_PROCESO',
    fechaRegistro: '01/11/2026',
  },
];

function solicitudesReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_SOLICITUD':
      return { ...state, solicitudes: [action.payload, ...state.solicitudes] };
    case 'UPDATE_SOLICITUD':
      return {
        ...state,
        solicitudes: state.solicitudes.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case 'CHANGE_ESTADO':
      return {
        ...state,
        solicitudes: state.solicitudes.map((s) =>
          s.id === action.payload.id ? { ...s, estado: action.payload.nuevoEstado } : s
        ),
      };
    case 'DELETE_SOLICITUD':
      return {
        ...state,
        solicitudes: state.solicitudes.filter((s) => s.id !== action.payload),
      };
    default:
      return state;
  }
}

interface SolicitudesContextProps {
  solicitudes: SolicitudAuto[];
  agregarSolicitud: (solicitud: SolicitudAuto) => void;
  actualizarSolicitud: (solicitud: SolicitudAuto) => void;
  cambiarEstado: (id: string, nuevoEstado: EstadoAuto) => void;
  eliminarSolicitud: (id: string) => void;
}

const SolicitudesContext = createContext<SolicitudesContextProps | undefined>(undefined);

export const SolicitudesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(solicitudesReducer, { solicitudes: solicitudesIniciales });

  const agregarSolicitud = (solicitud: SolicitudAuto) => {
    dispatch({ type: 'ADD_SOLICITUD', payload: solicitud });
  };

  const actualizarSolicitud = (solicitud: SolicitudAuto) => {
    dispatch({ type: 'UPDATE_SOLICITUD', payload: solicitud });
  };

  const cambiarEstado = (id: string, nuevoEstado: EstadoAuto) => {
    dispatch({ type: 'CHANGE_ESTADO', payload: { id, nuevoEstado } });
  };

  const eliminarSolicitud = (id: string) => {
    dispatch({ type: 'DELETE_SOLICITUD', payload: id });
  };

  return (
    <SolicitudesContext.Provider
      value={{
        solicitudes: state.solicitudes,
        agregarSolicitud,
        actualizarSolicitud,
        cambiarEstado,
        eliminarSolicitud,
      }}
    >
      {children}
    </SolicitudesContext.Provider>
  );
};

export const useSolicitudes = () => {
  const context = useContext(SolicitudesContext);
  if (!context) throw new Error('useSolicitudes debe usarse dentro de SolicitudesProvider');
  return context;
};