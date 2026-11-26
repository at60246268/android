import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";
import { useSolicitudes } from "../../infrastructura/context/SolicitudesContext";
import { SolicitudDetailScreen } from "../../presentacion/vistas/SolicitudDetailScreen";

export default function SolicitudDetailRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { solicitudes } = useSolicitudes();

  const solicitud = solicitudes.find((s) => s.id === id);

  if (!solicitud) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B0F17",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#FFFFFF" }}>Solicitud no encontrada</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B0F17" }}>
      <SolicitudDetailScreen
        solicitud={solicitud}
        onBack={() => router.back()}
        onEdit={(item) => router.push(`/solicitud/form?id=${item.id}` as any)}
      />
    </SafeAreaView>
  );
}
