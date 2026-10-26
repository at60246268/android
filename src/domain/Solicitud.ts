export type TipoServicioAuto =
  | "Mantenimiento Preventivo"
  | "Sistema de Frenos"
  | "Diagnóstico de Motor"
  | "Sistema Eléctrico"
  | "Suspensión y Dirección";

export type PrioridadAuto = "Baja" | "Media" | "Urgente";

export type EstadoAuto = "PENDIENTE" | "EN_REVISION" | "FINALIZADO";

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
}
