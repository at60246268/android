import { useRouter } from "expo-router";
import { LoginScreen } from "../../presentacion/vistas/LoginScreen";

export default function LoginRoute() {
  const router = useRouter();
  return (
    <LoginScreen
      onLoginSuccess={() => router.replace("/(tabs)" as any)}
      onNavigateToRegisterUser={() => router.push("/(auth)/register" as any)}
    />
  );
}
