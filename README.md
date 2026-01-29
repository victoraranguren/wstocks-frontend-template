# wStocks

Aplicación web (DApp) para tokenizar acciones del mundo real y representarlas como tokens en la red de Solana.

## Intro

wStocks te permite crear y visualizar tokens que representan acciones reales sobre Solana, integrándose con herramientas del ecosistema para ofrecer una experiencia rápida y sencilla desde el navegador.

## Tech stack

Este repositorio contiene el código fuente del **frontend**. Tecnologías principales:

- **Next.js** (App Router)
- **TypeScript**
- **TailwindCSS** & **shadcn/ui**
- **Framework kit** Solana kit y Solana Web3.js
- **TanStack Query** para manejo de datos remotos y caché

## Requisitos previos

- Node.js >= 18
- pnpm / npm / yarn instalado (el proyecto suele usar pnpm si está configurado en `package.json`)
- Una API key de **Helius** para conectarse a la red de Solana

## Instalación

1. Clona el repositorio:
   ```bash path=null start=null
   git clone <url-del-repo>
   cd rwa-frontend-template
   ```
2. Instala dependencias (ejemplo con pnpm):
   ```bash path=null start=null
   pnpm install
   ```

## Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto (o utiliza el mecanismo de variables de entorno de tu elección) y define:

```bash path=null start=null
NEXT_PUBLIC_API=<helius-api-key>
```

- `NEXT_PUBLIC_API`: API key de Helius utilizada para las peticiones relacionadas con la red de Solana.

## Scripts habituales

En función de cómo esté configurado el `package.json`, los comandos típicos serán:

- **Desarrollo**:
  ```bash path=null start=null
  pnpm dev
  ```
- **Build de producción**:
  ```bash path=null start=null
  pnpm build
  ```
- **Preview producción**:
  ```bash path=null start=null
  pnpm start
  ```

(Ajusta `pnpm` por `npm` o `yarn` si usas otro gestor de paquetes.)

## Arquitectura del proyecto

La aplicación está organizada en capas claras para separar UI, lógica de datos y conexión con Solana:

- `app/`
  - `layout.tsx`: layout raíz de Next.js. Configura fuentes, metadatos y envuelve toda la app con los *providers* globales:
    - `QueryProvider` (React Query) para *fetching* y caché de datos on-chain.
    - `Provider` de `solana/provider` que crea el cliente de Solana (Devnet) y expone el contexto de wallet a toda la UI.
    - `Toaster` para notificaciones (`sonner`).
  - `page.tsx`: página principal. Orquesta la experiencia de usuario:
    - Usa `useQuery` de TanStack Query para leer periódicamente el estado del *asset registry* y los tokens desde el programa RWA en Solana.
    - Pasa los datos resultantes a los componentes de presentación (`AssetRegistryCard`, `TokenMetadataCard`, etc.).

- `components/`
  - `header.tsx`: cabecera fija con navegación básica y el botón de conexión de wallet.
  - `connect-button-wallet.tsx`: componente que muestra el estado de la wallet (conectada/desconectada) y permite seleccionar Phantom/Solflare/Backpack usando los *hooks* de `@solana/react-hooks`.
  - `create-asset-form.tsx`: formulario principal para registrar un nuevo activo:
    - Gestiona el estado y validación del formulario (asset + token SPL).
    - Construye y envía la instrucción `initializeAsset` al programa RWA en Solana.
    - Usa `useSendTransaction` y `useWalletConnection` para firmar y enviar la transacción, e invalida la query `assets` de React Query tras el éxito.
  - `asset-registry-card.tsx`: muestra la información de cada registro de activo (ISIN, autoridad, tipo, fecha, legal docs) y permite cerrar/eliminar el registro vía una instrucción on-chain.
  - `token-metadata-card.tsx`: muestra metadatos del token SPL asociado (mint, supply, authority, programId) y expone una acción para incrementar el *supply* mediante una transacción al mismo programa.
  - `theme-provider.tsx`: envoltorio pequeño sobre `next-themes` para el manejo de temas.
  - `ui/`: colección de componentes de diseño reutilizables (botones, cards, inputs, selects, badges, toasts) generados con shadcn/ui y estilizados con Tailwind.

- `solana/provider/`
  - `provider.tsx`: define el `SolanaProvider` de alto nivel y configura el cliente de Solana apuntando a Devnet, habilitando autodetección de wallets en el navegador. Cualquier componente que use los *hooks* de `@solana/react-hooks` se apoya en este provider.

- `tanstack-query/components/`
  - `provider.tsx`: inicializa un `QueryClient` único por sesión y lo expone mediante `QueryClientProvider` para que `useQuery` y demás hooks funcionen en toda la app.

- `lib/`
  - `utils.ts`: utilidades de UI como `cn` para combinar clases Tailwind de forma segura.

- `styles/` y `app/globals.css`
  - Configuración global de estilos, tokens de color y ajustes visuales generales de la app.

## Contribuir

1. Crea una rama desde `dev`.
2. Implementa tus cambios.
3. Abre un Pull Request describiendo el cambio realizado.

## Licencia

Pendiente de definir o actualizar según las necesidades del proyecto.
