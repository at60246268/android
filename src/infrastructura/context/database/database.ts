import { SQLiteDatabase } from "expo-sqlite";

export async function inicializarBaseDatos(db: SQLiteDatabase): Promise<void> {
  try {
    console.log("[DB INIT] Inicializando base de datos local AutoFix...");

    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS solicitudes (
        id TEXT PRIMARY KEY NOT NULL,
        clienteNombre TEXT NOT NULL,
        telefono TEXT NOT NULL,
        vehiculoPlaca TEXT NOT NULL,
        vehiculoModelo TEXT NOT NULL,
        tipoServicio TEXT NOT NULL,
        prioridad TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        estado TEXT NOT NULL DEFAULT 'RECIBIDO',
        fechaRegistro TEXT NOT NULL,
        mensajeAdmin TEXT,
        usuarioCliente TEXT
      );
    `);

    const resultado = await db.getFirstAsync<{ total: number }>(
      "SELECT COUNT(*) as total FROM solicitudes;",
    );

    if (resultado && resultado.total === 0) {
      await db.runAsync(
        `INSERT INTO solicitudes (
          id, clienteNombre, telefono, vehiculoPlaca, vehiculoModelo,
          tipoServicio, prioridad, descripcion, estado, fechaRegistro,
          mensajeAdmin, usuarioCliente
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          "1",
          "JOSE",
          "982371347",
          "ABC-123",
          "Toyota Corolla 2020",
          "Diagnóstico general",
          "Media",
          "Ruido metálico al frenar en frío y baja presión de neumáticos.",
          "EN_PROCESO",
          "05/11/2026",
          "Su vehículo se encuentra en rampa de inspección.",
          "jose@gmail.com",
        ],
      );
      console.log("[DB INIT] Registro inicial de prueba insertado.");
    }

    console.log("[DB INIT] Tabla solicitudes lista.");
  } catch (error) {
    console.error("[DB INIT ERROR]", error);
    throw error;
  }
}
