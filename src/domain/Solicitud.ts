// Este tipo TipoServicioAuto representa los diferentes tipos de servicios que se pueden solicitar para un vehículo. Incluye opciones como diagnóstico general, mantenimiento preventivo, sistema de frenos, diagnóstico de motor, sistema eléctrico y suspensión y dirección.
export type TipoServicioAuto =
  | "Diagnóstico general"
  | "Mantenimiento Preventivo"
  | "Sistema de Frenos"
  | "Diagnóstico de Motor"
  | "Sistema Eléctrico"
  | "Suspensión y Dirección";

  // Este tipo PrioridadAuto representa los niveles de prioridad que se pueden asignar a una solicitud de servicio para un vehículo. Incluye opciones como baja, media y urgente.
export type PrioridadAuto = "Baja" | "Media" | "Urgente";

// Este tipo EstadoAuto representa los diferentes estados que puede tener una solicitud de servicio para un vehículo. Incluye opciones como recibido, en proceso y finalizado.
export type EstadoAuto = "RECIBIDO" | "EN_PROCESO" | "FINALIZADO";

// Esta interface SolicitudAuto representa una solicitud de servicio para un vehículo. Incluye propiedades como el ID de la solicitud, nombre del cliente, teléfono, placa y modelo del vehículo, tipo de servicio solicitado, prioridad, descripción del problema, estado de la solicitud, fecha de registro, mensaje del administrador (opcional) y usuario del cliente (opcional).
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
