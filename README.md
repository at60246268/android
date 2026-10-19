# AutoFix App

Aplicación móvil para gestionar solicitudes de un taller mecánico.
Permitir registrarse, iniciar sesión y enviar solicitudes de servicio para un vehículo.

## Tecnologías

- React Native con Expo
- TypeScript

## Instalación y ejecución

1. Instalar las dependencias:

```bash
npm install
```

2. Iniciar la app:

```bash
npx expo start
```

3. Abrir la app en el celular con la aplicación Expo Go, escaneando el código QR que aparece en el terminal.

## Estructura del proyecto

El código está organizado bajo el principio de separación de responsabilidades:

```text
autofix-app/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── CustomButton.tsx     # Botón táctil con variantes
│   │   └── CustomInput.tsx      # Campo de texto con labels y errores
│   ├── models/              # Interfaces y tipos de TypeScript
│   │   └── Solicitud.ts         # Datos de la solicitud automotriz
│   └── screens/             # Pantallas de la aplicación
│       ├── LoginScreen.tsx      # Inicio de sesión
│       ├── HomeScreen.tsx       # Pantalla principal
│       └── RegisterScreen.tsx   # Formulario de registro
├── index.tsx                  # Navegación y estado central
├── _layout.tsx             # Dependencias y scripts
└── README.md                # Documentación
```

## Equipo

- Saavedra Quispe, Alexander
- Acosta Palacios, Adrian
- Vasquez Aquino, Jeiser
- Palacios Quinde, Karin

## Institución

IDAT - Desarrollo de Sistemas Front-End y Back-End
