import { useRouter } from "expo-router";
import { LoginScreen } from "../../presentacion/vistas/LoginScreen";

// Esta función LoginRoute es un componente de React que representa la ruta de inicio de sesión en la aplicación. Utiliza el hook useRouter para manejar la navegación entre pantallas. 
export default function LoginRoute() {
  const router = useRouter();
  return (
    <LoginScreen
      onLoginSuccess={() => router.replace("/(tabs)" as any)}
      onNavigateToRegisterUser={() => router.push("/(auth)/register" as any)}
    />
  );
}
