import React, { createContext, useContext, useReducer } from "react";

interface AuthState {
  isLoggedIn: boolean;
  usuarioActual: string;
  usuariosRegistrados: Array<{ usuario: string; password: string; nombre?: string }>;
}

type AuthAction =
  | { type: "LOGIN"; payload: string }
  | { type: "LOGOUT" }
  | { type: "REGISTRAR_USUARIO"; payload: { usuario: string; password: string; nombre?: string } };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        usuarioActual: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        usuarioActual: "",
      };
    case "REGISTRAR_USUARIO":
      return {
        ...state,
        usuariosRegistrados: [action.payload, ...state.usuariosRegistrados],
      };
    default:
      return state;
  }
};

const initialAuthState: AuthState = {
  isLoggedIn: false,
  usuarioActual: "",
  usuariosRegistrados: [
    { usuario: "admin", password: "123456", nombre: "Administrador" }
  ],
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
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