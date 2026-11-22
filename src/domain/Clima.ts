// Definición de la interfaz ClimaActual que representa la información del clima actual de una ciudad
export interface ClimaActual {
  ciudad: string;
  temperatura: number;
  velocidadViento: number;
  codigoClima: number;
  descripcion: string;
  horaActualizacion: string;
}
