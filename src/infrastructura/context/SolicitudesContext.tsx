import React, { createContext, useContext, useReducer } from "react";
import { SolicitudAuto } from "../../domain/Solicitud";

interface SolicitudesState {
  solicitudes: SolicitudAuto[];
}

type SolicitudesAction =
  | { type: "AGREGAR_SOLICITUD"; payload: SolicitudAuto }
  | { type: "ELIMINAR_SOLICITUD"; payload: string }
  | { type: "ACTUALIZAR_SOLICITUD"; payload: SolicitudAuto };

const solicitudesReducer = (state: SolicitudesState, action: SolicitudesAction): SolicitudesState => {
  switch (action.type) {
    case "AGREGAR_SOLICITUD":
      return {
        ...state,
        solicitudes: [action.payload, ...state.solicitudes],
      };
    case "ELIMINAR_SOLICITUD":
      return {
        ...state,
        solicitudes: state.solicitudes.filter(s => s.id !== action.payload),
      };
    case "ACTUALIZAR_SOLICITUD":
      return {
        ...state,
        solicitudes: state.solicitudes.map(s => s.id === action.payload.id ? action.payload : s),
      };
    default:
      return state;
  }
};

const initialState: SolicitudesState = {
  solicitudes: [],
};

const SolicitudesContext = createContext<{
  state: SolicitudesState;
  dispatch: React.Dispatch<SolicitudesAction>;
} | undefined>(undefined);

export const SolicitudesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(solicitudesReducer, initialState);

  return (
    <SolicitudesContext.Provider value={{ state, dispatch }}>
      {children}
    </SolicitudesContext.Provider>
  );
};

export const useSolicitudes = () => {
  const context = useContext(SolicitudesContext);
  if (!context) {
    throw new Error("useSolicitudes debe usarse dentro de un SolicitudesProvider");
  }
  return context;
};