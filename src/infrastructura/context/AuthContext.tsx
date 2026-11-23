import React, { createContext, useContext, useReducer } from "react";

export type RolUsuario = "cliente" | "admin";
export type EstadoSesion = "guest" | "checking" | "auth" | "error";

export interface Usuario {
  usuario: string;
  nombre: string;
  rol: RolUsuario;
  telefono?: string;
}

interface UsuarioRegistrado extends Usuario {
  password: string;
}

interface AuthState {
  status: EstadoSesion;
  isLoggedIn: boolean;
  accessToken: string | null;
  usuarioActual: Usuario | null;
  error: string | null;
  usuariosRegistrados: UsuarioRegistrado[];
}

type AuthAction =
  | { type: "AUTH_CHECKING" }
  | { type: "LOGIN"; payload: Usuario; token?: string }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "LOGOUT" }
  | {
      type: "REGISTRAR_USUARIO";
      payload: UsuarioRegistrado;
    };

function generarAccessToken(usuario: Usuario): string {
  const timestamp = Date.now();
  const firma = `${usuario.usuario}:${usuario.rol}:${timestamp}`;
  return `autofix_tk_${btoa(firma).replace(/=/g, "")}`;
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_CHECKING":
      return {
        ...state,
        status: "checking",
        error: null,
      };
    case "LOGIN": {
      const token = action.token ?? generarAccessToken(action.payload);
      console.log(
        `[AUTH LOGIN] Usuario: ${action.payload.usuario} | Rol: ${action.payload.rol} | Token generado`,
      );
      return {
        ...state,
        status: "auth",
        isLoggedIn: true,
        accessToken: token,
        usuarioActual: action.payload,
        error: null,
      };
    }
    case "AUTH_ERROR":
      console.error("[AUTH ERROR]", action.payload);
      return {
        ...state,
        status: "error",
        isLoggedIn: false,
        accessToken: null,
        usuarioActual: null,
        error: action.payload,
      };
    case "LOGOUT":
      console.log("[AUTH LOGOUT] Sesión cerrada y accessToken revocado");
      return {
        ...state,
        status: "guest",
        isLoggedIn: false,
        accessToken: null,
        usuarioActual: null,
        error: null,
      };
    case "REGISTRAR_USUARIO":
      console.log(
        "[AUTH REGISTER] Nuevo usuario registrado:",
        action.payload.usuario,
      );
      return {
        ...state,
        usuariosRegistrados: [action.payload, ...state.usuariosRegistrados],
      };
    default:
      return state;
  }
};

const initialAuthState: AuthState = {
  status: "guest",
  isLoggedIn: false,
  accessToken: null,
  usuarioActual: null,
  error: null,
  usuariosRegistrados: [
    {
      usuario: "admin@autofix.com",
      password: "admin",
      nombre: "ALEX",
      rol: "admin",
    },
    {
      usuario: "jose@gmail.com",
      password: "123456",
      nombre: "JOSE",
      rol: "cliente",
      telefono: "982371347",
    },
  ],
};

interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

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
    <AuthContext.Provider value={{ state, dispatch, getAuthHeaders }}>
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
