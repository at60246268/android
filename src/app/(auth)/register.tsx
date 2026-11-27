import { useRouter } from "expo-router";
import { RegisterUserScreen } from "../../presentacion/vistas/RegisterUserScreen";

export default function RegisterRoute() {
  const router = useRouter();
  return <RegisterUserScreen onBackToLogin={() => router.back()} />;
}
