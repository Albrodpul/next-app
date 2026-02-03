# Next.js 14 Starter

> Proyecto de aprendizaje y base para aplicaciones Next.js 14 (React 18)

## 📚 Índice

1. [Introducción](#introducción)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Conceptos Clave de React y Next.js](#conceptos-clave-de-react-y-nextjs)
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

Este proyecto es una base moderna para aplicaciones Next.js 14 con React 18. Incluye ejemplos de arquitectura, patrones recomendados, internacionalización, manejo de estado, hooks personalizados, integración con Apollo Client y estilos con Tailwind + SCSS Modules.

### Stack Tecnológico

| Aspecto           | Tecnología         |
|-------------------|-------------------|
| Framework         | Next.js 14        |
| UI Library        | React 18          |
| State Management  | Context API + Hooks |
| Routing           | App Router        |
| Data Fetching     | Apollo Client     |
| i18n              | next-intl         |
| UI Components     | Custom + Tailwind |
| Styling           | SCSS Modules + Tailwind |

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

## Conceptos Clave de React y Next.js

### Estado y Efectos

```tsx
const [count, setCount] = useState(0)
const doubled = useMemo(() => count * 2, [count])

useEffect(() => {
  // Lógica de efecto
}, [count])
```

### Renderizado Condicional y Listas

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

### Props y Children

```tsx
interface Props {
  title: string
  onUpdate: (value: string) => void
  children?: React.ReactNode
}

function Component({ title, onUpdate, children }: Props) {
  // ...
  return <div>{title}{children}</div>
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

Los componentes son Server Components por defecto. Si necesitas interactividad (hooks, eventos), usa:

```tsx
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### 2. CSS Modules

```tsx
import styles from './Button.module.scss'

export function Button({ children }) {
  return <button className={styles.button}>{children}</button>
}
```

### 3. Componente por Archivo

```
Button/
├── Button.tsx
├── Button.module.scss
└── index.ts (re-export)
```

### 4. Hooks Personalizados

```tsx
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
  reactStrictMode: false,
  images: {
    domains: [],
  },
  sassOptions: {
    includePaths: ['./src/styles'],
  },
}

export default withNextIntl(nextConfig)
```

### Variables de Entorno (.env.local)

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_STRIPE_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_KEY=
```

---

## Componentes

### Componentes de UI (src/components/ui/)

#### Button

```tsx
import { Button } from '@/components/ui/Button'

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button leftIcon={<Icon name="arrow-left" />}>Back</Button>
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
```

#### Icon

```tsx
import { Icon } from '@/components/ui/Icon'

<Icon name="arrow-left" size={24} className="text-brand-gold" />
```

---

## Estado y Contexto

### AuthContext

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

```tsx
'use client'

import { useEventBus } from '@/contexts/EventBusContext'

function Component() {
  const { emit, on, off } = useEventBus()

  emit('drawer:open', { component: 'LoginDrawer' })

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
  fetchResults(debouncedSearch)
}, [debouncedSearch])
```

### useLocalStorage

```tsx
const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')
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
:root {
  --brand-gold: #b8860b;
  --brand-gold-light: #d4a843;
  --brand-off-black: #1a1a1a;
  --brand-off-white: #f5f5f5;
  // ...
}
```

### Tailwind + SCSS Modules

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
<AuthProvider>
  {children}
</AuthProvider>

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

1. Migrar páginas y componentes adicionales
2. Implementar tests con Jest/React Testing Library
3. Optimización: ISR/SSG donde sea apropiado
4. Configurar Analytics y monitoreo

---

## Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [next-intl Documentation](https://next-intl-docs.vercel.app)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
