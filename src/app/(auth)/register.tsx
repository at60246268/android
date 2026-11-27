import { useRouter } from "expo-router";
import { RegisterUserScreen } from "../../presentacion/vistas/RegisterUserScreen";

// Esta función RegisterRoute es un componente de React que representa la ruta de registro de usuario en la aplicación. Utiliza el hook useRouter para manejar la navegación entre pantallas.
export default function RegisterRoute() {
  const router = useRouter();
  return <RegisterUserScreen onBackToLogin={() => router.back()} />;
}
