# Propinita | Franco Campaiola

Propinita es un proyecto hecho en Next.JS con Supabase para facilitar el proceso de propinas en restaurantes, permitiendo a los clientes dejar propinas digitales y a los empleados recibirlas de manera segura y eficiente.


**Autor:** [@francocampaiola](https://twitter.com/francocampaiola)

## Requerimientos

- NodeJS (versión 18 o superior)
- Cuenta de Supabase
- Cuenta de MercadoPago para desarrolladores

## Instalación

```bash
git clone https://github.com/francocampaiola/propinita
cd propinita
```

## Instalación de paquetes de NPM

```bash
npm install
# o
yarn install
```

## Editar el archivo .env para desarrollo

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# MercadoPago
MP_API_URL=
MP_ACCESS_TOKEN=
MP_CLIENT_SECRET=
MP_MARKETPLACE_ID=
NEXT_PUBLIC_MP_PUBLIC_KEY=
NEXT_PUBLIC_MP_CLIENT_ID=
MP_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=
```

## Para correr entorno de desarrollo

```bash
npm run dev
# o
yarn dev
```

## Para correr entorno de producción

```bash
npm run build
npm run start
# o
yarn build
yarn start
```

## Flujo de la Aplicación

1. **Registro y Onboarding**:
   - El usuario se registra y completa un proceso de onboarding
   - Se verifica la identidad del usuario
   - Se vincula la cuenta de MercadoPago

2. **Proveedores**:
   - Crean su perfil profesional
   - Pueden generar links de pago para cobrar propinas
   - Pueden ver el historial de cobros y propinas

3. **Clientes**:
   - Dejan propinas digitales

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia el servidor de producción
- `npm run lint`: Ejecuta el linter

## Tecnologías Utilizadas

- [Next.js](https://nextjs.org/) - Framework de React
- [Chakra UI](https://chakra-ui.com/) - Biblioteca de componentes
- [Supabase](https://supabase.com/) - Backend y autenticación
- [MercadoPago](https://www.mercadopago.com.ar/) - Procesamiento de pagos
- [React Query](https://tanstack.com/query/latest) - Gestión de estado y caché
- [React Hook Form](https://react-hook-form.com/) - Manejo de formularios
- [Zod](https://zod.dev/) - Validación de esquemas
- [React Select](https://react-select.com/) - Componentes de selección
- [React Phone Number Input](https://github.com/catamphetamine/react-phone-number-input) - Input para números de teléfono
