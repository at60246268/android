import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
//Roles disponibles en la aplicación y estados posibles de la sesión
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { auth, db } from "./services/firebaseConfig";

//Estructura del perfil de usuario combinado (Auth + Firestore)
export type RolUsuario = "cliente" | "admin";
export type EstadoSesion = "guest" | "checking" | "auth" | "error";

//Estructura del perfil de usuario combinado (Auth + Firestore)
export interface Usuario {
  uid?: string;
  usuario: string;
  nombre: string;
  rol: RolUsuario;
  telefono?: string;
}

//Estado global de autenticación gestionado por el reducer
interface AuthState {
  status: EstadoSesion;
  isLoggedIn: boolean;
  accessToken: string | null;
  usuarioActual: Usuario | null;
  error: string | null;
}

//Acciones permitidas para modificar AuthState
type AuthAction =
  | { type: "AUTH_CHECKING" }
  | { type: "LOGIN"; payload: Usuario; token: string }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "LOGOUT" };

//Reducer: centraliza las transiciones de estado según la acción recibida
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_CHECKING":
      return {
        ...state,
        status: "checking",
        error: null,
      };
    case "LOGIN": {
      console.log(
        `[FIREBASE AUTH LOGIN] Usuario: ${action.payload.usuario} | Rol: ${action.payload.rol}`,
      );
      return {
        ...state,
        status: "auth",
        isLoggedIn: true,
        accessToken: action.token,
        usuarioActual: action.payload,
        error: null,
      };
    }
    case "AUTH_ERROR":
      console.warn("[FIREBASE AUTH ERROR]", action.payload);
      return {
        ...state,
        status: "error",
        isLoggedIn: false,
        accessToken: null,
        usuarioActual: null,
        error: action.payload,
      };
    case "LOGOUT":
      console.log("[FIREBASE AUTH LOGOUT] Sesión cerrada");
      return {
        ...state,
        status: "guest",
        isLoggedIn: false,
        accessToken: null,
        usuarioActual: null,
        error: null,
      };
    default:
      return state;
  }
};

//Estado inicial: comienza en "checking" mientras Firebase verifica la sesión activa
const initialAuthState: AuthState = {
  status: "checking",
  isLoggedIn: false,
  accessToken: null,
  usuarioActual: null,
  error: null,
};

//Contrato de valores y métodos expuestos por el contexto de autenticación
interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  loginConFirebase: (email: string, password: string) => Promise<void>;
  registrarConFirebase: (datos: {
    email: string;
    password: string;
    nombre: string;
    telefono: string;
  }) => Promise<void>;
  logoutConFirebase: () => Promise<void>;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

//Proveedor de autenticación que envuelve la app y sincroniza con Firebase
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
//Suscripción en tiempo real a cambios de sesión en Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      //Si no hay usuario autenticado, se restablece el estado a invitado
      if (!firebaseUser || !firebaseUser.email) {
        dispatch({ type: "LOGOUT" });
        return;
      }

      try {
        //Obtiene el ID token actual para autorizar peticiones al backend
        const token = await firebaseUser.getIdToken();
        const emailLower = firebaseUser.email.toLowerCase();
        const esAdmin = emailLower === "admin@autofix.com";
       //Valores por defecto antes de consultar el documento en Firestore
        let nombre =
          firebaseUser.displayName || emailLower.split("@")[0].toUpperCase();
        let telefono = "";
        let rol: RolUsuario = esAdmin ? "admin" : "cliente";
        
        //Recupera datos adicionales del perfil almacenados en Firestore
        const perfilRef = doc(db, "usuarios", firebaseUser.uid);
        const perfilSnap = await getDoc(perfilRef);

        if (perfilSnap.exists()) {
          const data = perfilSnap.data();
          nombre = data.nombre || nombre;
          telefono = data.telefono || "";
          //Prioriza el rol admin si coincide el correo; si no, usa el de Firestore
          rol = esAdmin ? "admin" : (data.rol as RolUsuario) || "cliente";
        }

        dispatch({
          type: "LOGIN",
          token,
          payload: {
            uid: firebaseUser.uid,
            usuario: emailLower,
            nombre,
            rol,
            telefono,
          },
        });
      } catch (error: any) {
        dispatch({
          type: "AUTH_ERROR",
          payload: error?.message || "Error al validar sesión en Firebase",
        });
      }
    });

    // Limpieza de la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);
  
  //Inicia sesión con correo y contraseña; onAuthStateChanged completará el estado LOGIN
  const loginConFirebase = async (email: string, password: string) => {
    dispatch({ type: "AUTH_CHECKING" });
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error: any) {
      let mensaje = "Credenciales incorrectas o usuario no encontrado";
      if (error?.code === "auth/invalid-credential") {
        mensaje = "Correo o contraseña incorrectos";
      } else if (error?.code === "auth/too-many-requests") {
        mensaje = "Demasiados intentos fallidos. Intenta más tarde";
      }
      dispatch({ type: "AUTH_ERROR", payload: mensaje });
      throw new Error(mensaje);
    }
  };

  //Registra un usuario en Auth, actualiza su displayName y crea su perfil en Firestore
  const registrarConFirebase = async ({
    email,
    password,
    nombre,
    telefono,
  }: {
    email: string;
    password: string;
    nombre: string;
    telefono: string;
  }) => {
    dispatch({ type: "AUTH_CHECKING" });
    try {
      const emailLimpio = email.trim().toLowerCase();
      const credencial = await createUserWithEmailAndPassword(
        auth,
        emailLimpio,
        password,
      );

      await updateProfile(credencial.user, {
        displayName: nombre.trim().toUpperCase(),
      });

      const rolAsignado: RolUsuario =
        emailLimpio === "admin@autofix.com" ? "admin" : "cliente";

        //Guarda el documento inicial del usuario usando su UID como ID de documento
      await setDoc(doc(db, "usuarios", credencial.user.uid), {
        uid: credencial.user.uid,
        usuario: emailLimpio,
        nombre: nombre.trim().toUpperCase(),
        telefono: telefono.trim(),
        rol: rolAsignado,
        creadoEn: new Date().toISOString(),
      });
    } catch (error: any) {
      let mensaje = "No se pudo registrar la cuenta";
      if (error?.code === "auth/email-already-in-use") {
        mensaje = "Este correo ya está registrado en Firebase";
      } else if (error?.code === "auth/weak-password") {
        mensaje = "La contraseña debe tener al menos 6 caracteres";
      }
      dispatch({ type: "AUTH_ERROR", payload: mensaje });
      throw new Error(mensaje);
    }
  };

  //Cierra la sesión en Firebase y limpia el estado local
  const logoutConFirebase = async () => {
    await signOut(auth);
    dispatch({ type: "LOGOUT" });
  };

  //Construye las cabeceras HTTP incluyendo el Bearer token si existe sesión activa
  const getAuthHeaders = (): Record<string, string> => {
    if (!state.accessToken) {
      return { "Content-Type": "application/json" };
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.accessToken}`,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        loginConFirebase,
        registrarConFirebase,
        logoutConFirebase,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//Hook personalizado para consumir el contexto de autenticación de forma segura
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
