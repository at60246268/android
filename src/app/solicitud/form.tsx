import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native";
import { useSolicitudes } from "../../infrastructura/context/SolicitudesContext";
import { SolicitudFormScreen } from "../../presentacion/vistas/SolicitudFormScreen";

export default function SolicitudFormRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { solicitudes } = useSolicitudes();

  const solicitudAEditar = id
    ? (solicitudes.find((s) => s.id === id) ?? null)
    : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B0F17" }}>
      <SolicitudFormScreen
        solicitudAEditar={solicitudAEditar}
        onBack={() => router.back()}
      />
    </SafeAreaView>
  );
}
