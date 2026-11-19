import { useSQLiteContext } from "expo-sqlite";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { EstadoAuto, SolicitudAuto } from "../../domain/Solicitud";
import { solicitudRepository } from "./database/solicitudRepository";

interface SolicitudesContextType {
  solicitudes: SolicitudAuto[];
  cargando: boolean;
  recargarSolicitudes: () => Promise<void>;
  agregarSolicitud: (solicitud: SolicitudAuto) => Promise<void>;
  actualizarSolicitud: (solicitud: SolicitudAuto) => Promise<void>;
  eliminarSolicitud: (id: string) => Promise<void>;
  cambiarEstado: (id: string, estado: EstadoAuto) => Promise<void>;
  enviarMensajeCliente: (id: string, mensaje: string) => Promise<void>;
}

const SolicitudesContext = createContext<SolicitudesContextType | undefined>(
  undefined,
);

export const SolicitudesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const db = useSQLiteContext();
  const [solicitudes, setSolicitudes] = useState<SolicitudAuto[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  const recargarSolicitudes = useCallback(async () => {
    try {
      setCargando(true);
      const data = await solicitudRepository.listar(db);
      setSolicitudes(data);
    } catch (error) {
      console.error("[SQLITE LISTAR ERROR]", error);
    } finally {
      setCargando(false);
    }
  }, [db]);

  useEffect(() => {
    recargarSolicitudes();
  }, [recargarSolicitudes]);

  const agregarSolicitud = async (solicitud: SolicitudAuto) => {
    await solicitudRepository.crear(db, solicitud);
    await recargarSolicitudes();
  };

  const actualizarSolicitud = async (solicitud: SolicitudAuto) => {
    await solicitudRepository.actualizar(db, solicitud);
    await recargarSolicitudes();
  };

  const eliminarSolicitud = async (id: string) => {
    await solicitudRepository.eliminar(db, id);
    await recargarSolicitudes();
  };

  const cambiarEstado = async (id: string, estado: EstadoAuto) => {
    await solicitudRepository.cambiarEstado(db, id, estado);
    await recargarSolicitudes();
  };

  const enviarMensajeCliente = async (id: string, mensaje: string) => {
    await solicitudRepository.enviarMensaje(db, id, mensaje);
    await recargarSolicitudes();
  };

  return (
    <SolicitudesContext.Provider
      value={{
        solicitudes,
        cargando,
        recargarSolicitudes,
        agregarSolicitud,
        actualizarSolicitud,
        eliminarSolicitud,
        cambiarEstado,
        enviarMensajeCliente,
      }}
    >
      {children}
    </SolicitudesContext.Provider>
  );
};

export const useSolicitudes = () => {
  const context = useContext(SolicitudesContext);
  if (!context)
    throw new Error("useSolicitudes debe usarse dentro de SolicitudesProvider");
  return context;
};
