import { useSQLiteContext } from "expo-sqlite";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { EstadoAuto, SolicitudAuto } from "../../domain/Solicitud";
import { solicitudRepository } from "./database/solicitudRepository";
import { db as firestoreDb } from "./services/firebaseConfig";

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
  const sqliteDb = useSQLiteContext();
  const [solicitudes, setSolicitudes] = useState<SolicitudAuto[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  const recargarSolicitudes = useCallback(async () => {
    try {
      setCargando(true);
      const data = await solicitudRepository.listar(sqliteDb);
      setSolicitudes(data);
    } catch (error: any) {
      if (String(error?.message).includes("closed resource")) {
        setTimeout(async () => {
          try {
            const reintento = await solicitudRepository.listar(sqliteDb);
            setSolicitudes(reintento);
          } catch {}
        }, 400);
      } else {
        console.warn("[SQLITE LISTAR AVISO]", error?.message);
      }
    } finally {
      setCargando(false);
    }
  }, [sqliteDb]);

  useEffect(() => {
    recargarSolicitudes();

    const solicitudesCol = collection(firestoreDb, "solicitudes");
    const unsubscribe = onSnapshot(
      solicitudesCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const remotas: SolicitudAuto[] = snapshot.docs.map(
            (documento) => documento.data() as SolicitudAuto,
          );
          console.log(
            `[FIRESTORE SYNC] ${remotas.length} solicitudes sincronizadas desde la nube`,
          );
          setSolicitudes(remotas);
        }
        setCargando(false);
      },
      (error) => {
        console.warn(
          "[FIRESTORE OFFLINE] Operando con respaldo local SQLite:",
          error.message,
        );
        setCargando(false);
      },
    );

    return () => unsubscribe();
  }, [recargarSolicitudes]);

  const agregarSolicitud = async (solicitud: SolicitudAuto) => {
    await solicitudRepository.crear(sqliteDb, solicitud);
    await recargarSolicitudes();
    try {
      await setDoc(doc(firestoreDb, "solicitudes", solicitud.id), {
        ...solicitud,
      });
      console.log(
        "[FIRESTORE CREATE] Solicitud guardada en nube:",
        solicitud.id,
      );
    } catch (error) {
      console.error("[FIRESTORE CREATE ERROR]", error);
    }
  };

  const actualizarSolicitud = async (solicitud: SolicitudAuto) => {
    await solicitudRepository.actualizar(sqliteDb, solicitud);
    await recargarSolicitudes();
    try {
      await setDoc(
        doc(firestoreDb, "solicitudes", solicitud.id),
        { ...solicitud },
        { merge: true },
      );
      console.log(
        "[FIRESTORE UPDATE] Solicitud actualizada en nube:",
        solicitud.id,
      );
    } catch (error) {
      console.error("[FIRESTORE UPDATE ERROR]", error);
    }
  };

  const eliminarSolicitud = async (id: string) => {
    await solicitudRepository.eliminar(sqliteDb, id);
    await recargarSolicitudes();
    try {
      await deleteDoc(doc(firestoreDb, "solicitudes", id));
      console.log("[FIRESTORE DELETE] Solicitud eliminada en nube:", id);
    } catch (error) {
      console.error("[FIRESTORE DELETE ERROR]", error);
    }
  };

  const cambiarEstado = async (id: string, estado: EstadoAuto) => {
    await solicitudRepository.cambiarEstado(sqliteDb, id, estado);
    await recargarSolicitudes();
    try {
      await updateDoc(doc(firestoreDb, "solicitudes", id), { estado });
      console.log(`[FIRESTORE ESTADO] ${id} -> ${estado}`);
    } catch (error) {
      console.error("[FIRESTORE ESTADO ERROR]", error);
    }
  };

  const enviarMensajeCliente = async (id: string, mensaje: string) => {
    await solicitudRepository.enviarMensaje(sqliteDb, id, mensaje);
    await recargarSolicitudes();
    try {
      await updateDoc(doc(firestoreDb, "solicitudes", id), {
        mensajeTaller: mensaje,
      });
      console.log(`[FIRESTORE MENSAJE] Mensaje enviado para ${id}`);
    } catch (error) {
      console.error("[FIRESTORE MENSAJE ERROR]", error);
    }
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
