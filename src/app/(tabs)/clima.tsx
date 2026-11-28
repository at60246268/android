import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native";
import { ClimaScreen } from "../../presentacion/vistas/ClimaScreen";

// Esta función ClimaTab es un componente de React que representa la pestaña de clima en la aplicación. Utiliza el hook useRouter para manejar la navegación entre pantallas.
export default function ClimaTab() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B0F17" }}>
      <ClimaScreen onBack={() => router.replace("/(tabs)" as any)} />
    </SafeAreaView>
  );
}
