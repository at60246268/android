import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

// Importación de Contextos / Providers
import { AuthProvider } from '../infrastructura/context/AuthContext';
import { SolicitudesProvider } from '../infrastructura/context/SolicitudesContext';

// Importación de Pantallas
import { LoginScreen } from '../presentacion/vistas/LoginScreen';
import { HomeScreen } from '../presentacion/vistas/HomeScreen';
import { RegisterUserScreen } from '../presentacion/vistas/RegisterUserScreen';
import { SolicitudFormScreen } from '../presentacion/vistas/SolicitudFormScreen';
import { SolicitudesListScreen } from '../presentacion/vistas/SolicitudesListScreen';
import { SolicitudDetailScreen } from '../presentacion/vistas/SolicitudDetailScreen';
import { SolicitudAuto } from '../domain/Solicitud';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState('');
  const [vistaActual, setVistaActual] = useState<'home' | 'list' | 'create' | 'detail' | 'registerUser'>('home');
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudAuto | null>(null);

  if (!isLoggedIn) {
    if (vistaActual === 'registerUser') {
      return <RegisterUserScreen onBackToLogin={() => setVistaActual('home')} />;
    }
    return (
      <LoginScreen
        onLoginSuccess={(u) => {
          setUsuarioActual(u);
          setIsLoggedIn(true);
          setVistaActual('home');
        }}
        onNavigateToRegisterUser={() => setVistaActual('registerUser')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {vistaActual === 'home' && (
        <HomeScreen
          usuario={usuarioActual}
          totalSolicitudes={0}
          onNavigateToList={() => setVistaActual('list')}
          onNavigateToRegister={() => {
            setSolicitudSeleccionada(null);
            setVistaActual('create');
          }}
          onLogout={() => setIsLoggedIn(false)}
        />
      )}

      {vistaActual === 'list' && (
        <SolicitudesListScreen
          onBack={() => setVistaActual('home')}
          onNewSolicitud={() => {
            setSolicitudSeleccionada(null);
            setVistaActual('create');
          }}
          onSelectSolicitud={(item) => {
            setSolicitudSeleccionada(item);
            setVistaActual('detail');
          }}
        />
      )}

      {vistaActual === 'create' && (
        <SolicitudFormScreen
          solicitudAEditar={solicitudSeleccionada}
          onBack={() => setVistaActual('list')}
        />
      )}

      {vistaActual === 'detail' && solicitudSeleccionada && (
        <SolicitudDetailScreen
          solicitud={solicitudSeleccionada}
          onBack={() => setVistaActual('list')}
          onEdit={(item) => {
            setSolicitudSeleccionada(item);
            setVistaActual('create');
          }}
        />
      )}
    </SafeAreaView>
  );
}

// ⚠️ AQUÍ ESTÁ LA CLAVE: Envolver todo dentro de AuthProvider y SolicitudesProvider
export default function Index() {
  return (
    <AuthProvider>
      <SolicitudesProvider>
        <AppContent />
      </SolicitudesProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});