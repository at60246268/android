import { ClimaActual } from "../../../domain/Clima";

const URL_CLIMA_LIMA =
  "https://api.open-meteo.com/v1/forecast?latitude=-12.0464&longitude=-77.0428&current_weather=true&timezone=America%2FLima";

function interpretarCodigoWMO(codigo: number): string {
  if (codigo === 0) return "Cielo despejado";
  if (codigo >= 1 && codigo <= 3) return "Parcialmente nublado";
  if (codigo === 45 || codigo === 48) return "Neblina";
  if (codigo >= 51 && codigo <= 67) return "Llovizna o lluvia ligera";
  if (codigo >= 80 && codigo <= 82) return "Chubascos";
  return "Condición variable";
}

export const climaService = {
  async obtenerClimaLima(): Promise<ClimaActual> {
    console.log("[API REQUEST] GET", URL_CLIMA_LIMA);

    const respuesta = await fetch(URL_CLIMA_LIMA);

    if (!respuesta.ok) {
      console.error("[API ERROR]", respuesta.status);
      throw new Error("No se pudo obtener el clima del servidor.");
    }

    const json = await respuesta.json();
    console.log("[API RESPONSE] 200", json.current_weather);

    const actual = json.current_weather;

    return {
      ciudad: "Lima, Perú (Sede Taller)",
      temperatura: actual.temperature,
      velocidadViento: actual.windspeed,
      codigoClima: actual.weathercode,
      descripcion: interpretarCodigoWMO(actual.weathercode),
      horaActualizacion: actual.time.replace("T", " "),
    };
  },
};
