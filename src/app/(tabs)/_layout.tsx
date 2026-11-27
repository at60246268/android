import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#111827",
          borderTopColor: "#1F2937",
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: "#FF5722",
        tabBarInactiveTintColor: "#9CA3AF",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="solicitudes"
        options={{
          title: "Solicitudes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="car-sport-outline"
              size={size}
              color={String(color)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="clima"
        options={{
          title: "Clima Sede",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="partly-sunny-outline"
              size={size}
              color={String(color)}
            />
          ),
        }}
      />
    </Tabs>
  );
}
