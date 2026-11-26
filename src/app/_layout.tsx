import { Stack, useRouter, useSegments } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { AuthProvider, useAuth } from "../infrastructura/context/AuthContext";
import { inicializarBaseDatos } from "../infrastructura/context/database/database";
import { SolicitudesProvider } from "../infrastructura/context/SolicitudesContext";

function RootNavigator() {
  const { state } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const tieneSesionValida = state.isLoggedIn && Boolean(state.accessToken);

  useEffect(() => {
    if (state.status === "checking") return;

    const primerSegmento = segments[0] as string | undefined;
    const enGrupoAuth = primerSegmento === "(auth)";

    if (!tieneSesionValida && !enGrupoAuth) {
      router.replace("/(auth)/login" as any);
    } else if (tieneSesionValida && enGrupoAuth) {
      router.replace("/(tabs)" as any);
    }
  }, [tieneSesionValida, state.status, segments, router]);

  if (state.status === "checking") {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF5722" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0B0F17" },
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="solicitud/form" />
      <Stack.Screen name="solicitud/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="autofix_local.db"
      onInit={inicializarBaseDatos}
    >
      <AuthProvider>
        <SolicitudesProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </SolicitudesProvider>
      </AuthProvider>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: "#0B0F17",
    justifyContent: "center",
    alignItems: "center",
  },
});
