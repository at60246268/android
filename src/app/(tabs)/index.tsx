import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native";
import { useAuth } from "../../infrastructura/context/AuthContext";
import { HomeScreen } from "../../presentacion/vistas/HomeScreen";

// Esta función HomeTab es un componente de React que representa la pestaña de inicio en la aplicación. Utiliza el hook useRouter para manejar la navegación entre pantallas y el hook useAuth para manejar la autenticación del usuario.
export default function HomeTab() {
  const router = useRouter();
  const { logoutConFirebase } = useAuth();

  const handleLogout = async () => {
    await logoutConFirebase();
    router.replace("/(auth)/login" as any);
  };

  // Renderiza la pantalla de inicio dentro de un SafeAreaView, pasando las funciones de navegación y cierre de sesión como props al componente HomeScreen.
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B0F17" }}>
      <HomeScreen
        onNavigateToList={() => router.push("/(tabs)/solicitudes" as any)}
        onNavigateToRegister={() => router.push("/solicitud/form" as any)}
        onNavigateToClima={() => router.push("/(tabs)/clima" as any)}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
}
