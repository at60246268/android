import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { auth, db } from "./services/firebaseConfig";

export type RolUsuario = "cliente" | "admin";
export type EstadoSesion = "guest" | "checking" | "auth" | "error";

export interface Usuario {
  uid?: string;
  usuario: string;
  nombre: string;
  rol: RolUsuario;
  telefono?: string;
}

interface AuthState {
  status: EstadoSesion;
  isLoggedIn: boolean;
  accessToken: string | null;
  usuarioActual: Usuario | null;
  error: string | null;
}

type AuthAction =
  | { type: "AUTH_CHECKING" }
  | { type: "LOGIN"; payload: Usuario; token: string }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "LOGOUT" };

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

const initialAuthState: AuthState = {
  status: "checking",
  isLoggedIn: false,
  accessToken: null,
  usuarioActual: null,
  error: null,
};

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser || !firebaseUser.email) {
        dispatch({ type: "LOGOUT" });
        return;
      }

      try {
        const token = await firebaseUser.getIdToken();
        const emailLower = firebaseUser.email.toLowerCase();
        const esAdmin = emailLower === "admin@autofix.com";

        let nombre =
          firebaseUser.displayName || emailLower.split("@")[0].toUpperCase();
        let telefono = "";
        let rol: RolUsuario = esAdmin ? "admin" : "cliente";

        const perfilRef = doc(db, "usuarios", firebaseUser.uid);
        const perfilSnap = await getDoc(perfilRef);

        if (perfilSnap.exists()) {
          const data = perfilSnap.data();
          nombre = data.nombre || nombre;
          telefono = data.telefono || "";
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

    return () => unsubscribe();
  }, []);

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

  const logoutConFirebase = async () => {
    await signOut(auth);
    dispatch({ type: "LOGOUT" });
  };

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
