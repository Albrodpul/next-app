# Paradise a La Carte - Next.js Migration

> Migración del proyecto de Nuxt (Vue 3) a Next.js 14 (React 18)

## 📚 Índice

1. [Introducción](#introducción)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [React vs Vue: Conceptos Clave](#react-vs-vue-conceptos-clave)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Patrones y Convenciones](#patrones-y-convenciones)
6. [Configuración](#configuración)
7. [Componentes](#componentes)
8. [Estado y Contexto](#estado-y-contexto)
9. [Hooks Personalizados](#hooks-personalizados)
10. [Estilos](#estilos)
11. [Internacionalización](#internacionalización)
12. [GraphQL y Apollo](#graphql-y-apollo)
13. [Autenticación](#autenticación)
14. [Cómo Ejecutar](#cómo-ejecutar)

---

## Introducción

Este proyecto es una migración completa de una aplicación Nuxt/Vue a Next.js/React. El objetivo es mantener la misma funcionalidad mientras aprovechamos las ventajas del ecosistema React.

### Stack Tecnológico

| Aspecto | Nuxt (Original) | Next.js (Nuevo) |
|---------|-----------------|-----------------|
| Framework | Nuxt 4 | Next.js 14 |
| UI Library | Vue 3 | React 18 |
| State Management | Vue Reactivity + Provide/Inject | Context API + Hooks |
| Routing | Nuxt Pages | App Router |
| Data Fetching | Apollo Client | Apollo Client |
| i18n | vue-i18n | next-intl |
| UI Components | Element Plus | Custom + Tailwind |
| Styling | SCSS + Tailwind | SCSS Modules + Tailwind |

---

## Arquitectura del Proyecto

```
next-app/
├── src/
│   ├── app/                    # App Router (páginas)
│   │   ├── layout.tsx          # Layout raíz
│   │   ├── page.tsx            # Página principal
│   │   └── providers.tsx       # Providers globales
│   │
│   ├── components/             # Componentes React
│   │   ├── home/               # Componentes de la página home
│   │   ├── layout/             # Header, Footer
│   │   └── ui/                 # Componentes reutilizables
│   │
│   ├── contexts/               # Contextos de React
│   │   ├── AuthContext.tsx     # Autenticación
│   │   └── EventBusContext.tsx # Sistema de eventos
│   │
│   ├── hooks/                  # Hooks personalizados
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── ...
│   │
│   ├── i18n/                   # Configuración de idiomas
│   │   ├── config.ts           # Locales disponibles
│   │   ├── request.ts          # Configuración next-intl
│   │   └── messages/           # Archivos de traducción
│   │
│   ├── lib/                    # Utilidades y configuraciones
│   │   └── apollo/             # Cliente Apollo GraphQL
│   │
│   ├── styles/                 # Estilos globales
│   │   ├── globals.scss
│   │   └── variables/
│   │
│   └── types/                  # Tipos TypeScript
│
├── next.config.ts              # Configuración de Next.js
├── tailwind.config.ts          # Configuración de Tailwind
└── tsconfig.json               # Configuración de TypeScript
```

---

## React vs Vue: Conceptos Clave

### 1. Reactividad

**Vue** usa un sistema de reactividad basado en `ref()` y `reactive()`:

```vue
<script setup>
const count = ref(0)
const doubled = computed(() => count.value * 2)

const increment = () => {
  count.value++
}
</script>
```

**React** usa `useState` para estado y re-renderiza cuando cambia:

```tsx
const [count, setCount] = useState(0)
const doubled = useMemo(() => count * 2, [count])

const increment = () => {
  setCount(prev => prev + 1)
}
```

### 2. Ciclo de Vida

| Vue | React |
|-----|-------|
| `onMounted(() => {})` | `useEffect(() => {}, [])` |
| `onUnmounted(() => {})` | `useEffect(() => () => cleanup, [])` |
| `watch(ref, callback)` | `useEffect(() => callback, [dependency])` |
| `computed(() => value)` | `useMemo(() => value, [deps])` |

### 3. Renderizado Condicional

**Vue** usa directivas:
```vue
<template>
  <div v-if="isVisible">Visible</div>
  <div v-else>Hidden</div>
  <ul>
    <li v-for="item in items" :key="item.id">{{ item.name }}</li>
  </ul>
</template>
```

**React** usa JavaScript directamente:
```tsx
return (
  <>
    {isVisible ? <div>Visible</div> : <div>Hidden</div>}
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  </>
)
```

### 4. Props y Eventos

**Vue**:
```vue
<script setup>
const props = defineProps<{ title: string }>()
const emit = defineEmits<{ (e: 'update', value: string): void }>()
</script>
```

**React**:
```tsx
interface Props {
  title: string
  onUpdate: (value: string) => void
}

function Component({ title, onUpdate }: Props) {
  // onUpdate es simplemente una función que se pasa como prop
}
```

### 5. Slots vs Children

**Vue** usa slots:
```vue
<template>
  <slot name="header" />
  <slot /> <!-- default slot -->
  <slot name="footer" />
</template>
```

**React** usa children y render props:
```tsx
interface Props {
  header?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}

function Layout({ header, children, footer }: Props) {
  return (
    <>
      {header}
      {children}
      {footer}
    </>
  )
}
```

---

## Estructura de Carpetas

### App Router (src/app/)

Next.js 14 usa el App Router donde cada carpeta representa una ruta:

```
app/
├── page.tsx           → /
├── about/
│   └── page.tsx       → /about
├── blog/
│   ├── page.tsx       → /blog
│   └── [slug]/
│       └── page.tsx   → /blog/:slug
└── layout.tsx         → Layout compartido
```

### Componentes

Organizados por dominio/funcionalidad:

```
components/
├── ui/           # Componentes base reutilizables
│   ├── Button/
│   ├── Icon/
│   └── Avatar/
├── layout/       # Componentes de estructura
│   ├── Header/
│   └── Footer/
└── home/         # Componentes específicos de página
    ├── HeroSection/
    └── ShowMeTabs/
```

---

## Patrones y Convenciones

### 1. 'use client' Directive

En Next.js 14, los componentes son Server Components por defecto. Si necesitas interactividad (hooks, eventos), debes marcarlos:

```tsx
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### 2. CSS Modules

Usamos CSS Modules para encapsular estilos:

```tsx
// Button.tsx
import styles from './Button.module.scss'

export function Button({ children }) {
  return <button className={styles.button}>{children}</button>
}
```

```scss
// Button.module.scss
.button {
  padding: 12px 24px;
  background: var(--brand-gold);
}
```

### 3. Componente por Archivo

Cada componente tiene su propio archivo con estilos asociados:

```
Button/
├── Button.tsx
├── Button.module.scss
└── index.ts (re-export)
```

### 4. Hooks Personalizados

Encapsulamos lógica reutilizable en hooks:

```tsx
// ❌ Lógica duplicada en componentes
function Component1() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
}

// ✅ Hook reutilizable
function Component1() {
  const { width } = useWindowSize()
}
```

---

## Configuración

### next.config.ts

```ts
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig = {
  // Deshabilitamos SSR estricto como en el proyecto original
  reactStrictMode: false,
  
  // Optimización de imágenes
  images: {
    domains: ['paradise-a-la-carte.s3.amazonaws.com', /* ... */],
  },
  
  // Soporte SCSS
  sassOptions: {
    includePaths: ['./src/styles'],
  },
}

export default withNextIntl(nextConfig)
```

### Variables de Entorno (.env.local)

```env
NEXT_PUBLIC_API_URL=https://api.paradisealacarte.com/graphql
NEXT_PUBLIC_STRIPE_KEY=pk_live_...
NEXT_PUBLIC_GOOGLE_MAPS_KEY=...
```

---

## Componentes

### Componentes de UI (src/components/ui/)

#### Button

Reemplaza a `ElButton` de Element Plus:

```tsx
import { Button } from '@/components/ui/Button'

// Variantes disponibles
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Con iconos
<Button leftIcon={<Icon name="arrow-left" />}>Back</Button>

// Estados
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
```

#### Icon

Sistema de iconos SVG:

```tsx
import { Icon } from '@/components/ui/Icon'

<Icon name="arrow-left" size={24} className="text-brand-gold" />
```

---

## Estado y Contexto

### AuthContext

Reemplaza a `getAuthUser` y `getAuthRoles` composables:

```tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'

function Profile() {
  const { user, isAuthenticated, login, logout } = useAuth()

  if (!isAuthenticated) {
    return <LoginButton />
  }

  return <div>Welcome, {user.name}</div>
}
```

### EventBusContext

Reemplaza al plugin mitt ($eventBus):

```tsx
'use client'

import { useEventBus } from '@/contexts/EventBusContext'

function Component() {
  const { emit, on, off } = useEventBus()

  // Emitir evento
  emit('drawer:open', { component: 'LoginDrawer' })

  // Escuchar evento
  useEffect(() => {
    const unsubscribe = on('drawer:open', (data) => {
      console.log('Drawer opened:', data)
    })
    return unsubscribe
  }, [on])
}
```

---

## Hooks Personalizados

### useDebounce

```tsx
const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 300)

useEffect(() => {
  // Solo se ejecuta 300ms después de que el usuario deja de escribir
  fetchResults(debouncedSearch)
}, [debouncedSearch])
```

### useLocalStorage

```tsx
const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')

// Persistido automáticamente en localStorage
setTheme('dark')
```

### useClickOutside

```tsx
const ref = useClickOutside<HTMLDivElement>(() => {
  setIsOpen(false)
})

return <div ref={ref}>Dropdown content</div>
```

### useIntersectionObserver

```tsx
const [ref, isVisible] = useInView({ threshold: 0.5 })

return (
  <div ref={ref} className={isVisible ? 'animate-in' : 'opacity-0'}>
    Content that animates when visible
  </div>
)
```

---

## Estilos

### Variables CSS (src/styles/variables/)

```scss
// colors.scss
:root {
  --brand-gold: #b8860b;
  --brand-gold-light: #d4a843;
  --brand-off-black: #1a1a1a;
  --brand-off-white: #f5f5f5;
  // ...
}
```

### Tailwind + SCSS Modules

Combinamos Tailwind para utilidades y SCSS Modules para componentes:

```tsx
<div className={cn(styles.card, 'p-4 hover:shadow-lg')}>
  Content
</div>
```

---

## Internacionalización

### Configuración

```ts
// src/i18n/config.ts
export const locales = ['en', 'es', 'fr', 'de', 'sv', 'ar'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'en'
```

### Uso en Componentes

```tsx
import { useTranslations } from 'next-intl'

function Header() {
  const t = useTranslations('header')
  
  return <nav>{t('home')}</nav>
}
```

### Archivos de Traducción

```json
// src/i18n/messages/es.json
{
  "header": {
    "home": "Inicio",
    "experiences": "Experiencias"
  }
}
```

---

## GraphQL y Apollo

### Cliente Apollo

```ts
// src/lib/apollo/client.ts
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL,
  cache: new InMemoryCache(),
  // ... configuración con token refresh
})
```

### Uso en Componentes

```tsx
import { useQuery } from '@apollo/client'
import { GET_EXPERIENCES } from '@/graphql/experiences'

function Experiences() {
  const { data, loading, error } = useQuery(GET_EXPERIENCES)

  if (loading) return <Spinner />
  if (error) return <Error message={error.message} />

  return data.experiences.map(exp => (
    <ExperienceCard key={exp.id} {...exp} />
  ))
}
```

---

## Autenticación

### Middleware de Protección

```ts
// src/middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')
  
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/account/:path*', '/bookings/:path*']
}
```

### AuthContext

```tsx
// Proveedor en layout
<AuthProvider>
  {children}
</AuthProvider>

// Consumo en componentes
const { user, login, logout, isAuthenticated } = useAuth()
```

---

## Cómo Ejecutar

### Desarrollo

```bash
cd next-app
npm install
npm run dev
```

### Producción

```bash
npm run build
npm run start
```

### Variables de Entorno Requeridas

Copia `.env.example` a `.env.local` y configura:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_STRIPE_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_KEY=
NEXT_PUBLIC_FIREBASE_CONFIG=
```

---

## Próximos Pasos

1. **Migrar páginas restantes**: Convertir las ~50 páginas de Vue a React
2. **Migrar componentes**: Convertir los ~100+ componentes
3. **Tests**: Implementar tests con Jest/React Testing Library
4. **Optimización**: Implementar ISR/SSG donde sea apropiado
5. **Analytics**: Configurar Google Analytics y Sentry

---

## Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [next-intl Documentation](https://next-intl-docs.vercel.app)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
