import { SQLiteDatabase } from "expo-sqlite";
import { EstadoAuto, SolicitudAuto } from "../../../domain/Solicitud";

export const solicitudRepository = {
  async listar(db: SQLiteDatabase): Promise<SolicitudAuto[]> {
    console.log("[SQL SELECT] Consultando solicitudes...");
    const filas = await db.getAllAsync<SolicitudAuto>(
      `SELECT id, clienteNombre, telefono, vehiculoPlaca, vehiculoModelo,
              tipoServicio, prioridad, descripcion, estado, fechaRegistro,
              mensajeAdmin, usuarioCliente
       FROM solicitudes
       ORDER BY rowid DESC;`,
    );
    return filas;
  },

  async crear(db: SQLiteDatabase, solicitud: SolicitudAuto): Promise<void> {
    console.log("[SQL INSERT] Guardando solicitud:", solicitud.id);
    await db.runAsync(
      `INSERT INTO solicitudes (
        id, clienteNombre, telefono, vehiculoPlaca, vehiculoModelo,
        tipoServicio, prioridad, descripcion, estado, fechaRegistro,
        mensajeAdmin, usuarioCliente
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        solicitud.id,
        solicitud.clienteNombre,
        solicitud.telefono,
        solicitud.vehiculoPlaca,
        solicitud.vehiculoModelo,
        solicitud.tipoServicio,
        solicitud.prioridad,
        solicitud.descripcion,
        solicitud.estado,
        solicitud.fechaRegistro,
        solicitud.mensajeAdmin ?? null,
        solicitud.usuarioCliente ?? null,
      ],
    );
  },

  async actualizar(
    db: SQLiteDatabase,
    solicitud: SolicitudAuto,
  ): Promise<void> {
    console.log("[SQL UPDATE] Actualizando solicitud:", solicitud.id);
    await db.runAsync(
      `UPDATE solicitudes
       SET clienteNombre = ?,
           telefono = ?,
           vehiculoPlaca = ?,
           vehiculoModelo = ?,
           tipoServicio = ?,
           prioridad = ?,
           descripcion = ?,
           estado = ?,
           mensajeAdmin = ?
       WHERE id = ?;`,
      [
        solicitud.clienteNombre,
        solicitud.telefono,
        solicitud.vehiculoPlaca,
        solicitud.vehiculoModelo,
        solicitud.tipoServicio,
        solicitud.prioridad,
        solicitud.descripcion,
        solicitud.estado,
        solicitud.mensajeAdmin ?? null,
        solicitud.id,
      ],
    );
  },

  async cambiarEstado(
    db: SQLiteDatabase,
    id: string,
    estado: EstadoAuto,
  ): Promise<void> {
    console.log("[SQL UPDATE] Cambiando estado:", id, "->", estado);
    await db.runAsync(`UPDATE solicitudes SET estado = ? WHERE id = ?;`, [
      estado,
      id,
    ]);
  },

  async enviarMensaje(
    db: SQLiteDatabase,
    id: string,
    mensaje: string,
  ): Promise<void> {
    console.log("[SQL UPDATE] Guardando mensaje admin en:", id);
    await db.runAsync(`UPDATE solicitudes SET mensajeAdmin = ? WHERE id = ?;`, [
      mensaje,
      id,
    ]);
  },

  async eliminar(db: SQLiteDatabase, id: string): Promise<void> {
    console.log("[SQL DELETE] Eliminando solicitud:", id);
    await db.runAsync(`DELETE FROM solicitudes WHERE id = ?;`, [id]);
  },
};
