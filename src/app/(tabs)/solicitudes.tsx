import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native";
import { SolicitudesListScreen } from "../../presentacion/vistas/SolicitudesListScreen";

export default function SolicitudesTab() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B0F17" }}>
      <SolicitudesListScreen
        onBack={() => router.replace("/(tabs)" as any)}
        onNewSolicitud={() => router.push("/solicitud/form" as any)}
        onSelectSolicitud={(item) =>
          router.push(`/solicitud/${item.id}` as any)
        }
      />
    </SafeAreaView>
  );
}
