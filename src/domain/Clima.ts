// Este archivo define la interfaz ClimaActual que representa la información del clima actual de una ciudad. La interfaz incluye propiedades para la ciudad, temperatura, velocidad del viento, código del clima, descripción y hora de actualización.
export interface ClimaActual {
  ciudad: string;
  temperatura: number;
  velocidadViento: number;
  codigoClima: number;
  descripcion: string;
  horaActualizacion: string;
}
