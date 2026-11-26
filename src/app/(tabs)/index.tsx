import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native";
import { useAuth } from "../../infrastructura/context/AuthContext";
import { HomeScreen } from "../../presentacion/vistas/HomeScreen";

export default function HomeTab() {
  const router = useRouter();
  const { logoutConFirebase } = useAuth();

  const handleLogout = async () => {
    await logoutConFirebase();
    router.replace("/(auth)/login" as any);
  };

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
