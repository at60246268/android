// Definición de la interfaz TipoServicioAuto que representa los diferentes tipos de servicios automotrices disponibles
export type TipoServicioAuto =
  | "Diagnóstico general"
  | "Mantenimiento Preventivo"
  | "Sistema de Frenos"
  | "Diagnóstico de Motor"
  | "Sistema Eléctrico"
  | "Suspensión y Dirección";

// Definición de la interfaz PrioridadAuto que representa la prioridad de una solicitud de servicio automotriz
export type PrioridadAuto = "Baja" | "Media" | "Urgente";

// Definición de la interfaz EstadoAuto que representa el estado de una solicitud de servicio automotriz
export type EstadoAuto = "RECIBIDO" | "EN_PROCESO" | "FINALIZADO";

// Definición de la interfaz SolicitudAuto que representa una solicitud de servicio automotriz realizada por un cliente
export interface SolicitudAuto {
  id: string;
  clienteNombre: string;
  telefono: string;
  vehiculoPlaca: string;
  vehiculoModelo: string;
  tipoServicio: TipoServicioAuto;
  prioridad: PrioridadAuto;
  descripcion: string;
  estado: EstadoAuto;
  fechaRegistro: string;
  mensajeAdmin?: string;
  usuarioCliente?: string;
}
