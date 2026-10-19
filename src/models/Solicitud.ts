export type TipoServicioAuto =
  | "Mantenimiento Preventivo"
  | "Sistema de Frenos"
  | "Diagnóstico de Motor"
  | "Sistema Electrico"
  | "Suspensión y Dirección";

export type PrioridadAuto = "Alta" | "Media" | "Urgente";

export type EstadoAuto = "Pendiente" | "En Proceso" | "Finalizado";

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
