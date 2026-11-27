import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native";
import { ClimaScreen } from "../../presentacion/vistas/ClimaScreen";

export default function ClimaTab() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B0F17" }}>
      <ClimaScreen onBack={() => router.replace("/(tabs)" as any)} />
    </SafeAreaView>
  );
}
