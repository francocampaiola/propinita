import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mi Perfil | Propinita',
  description: 'Gestiona tu información personal, datos de contacto y configuración de tu cuenta',
  openGraph: {
    title: 'Mi Perfil | Propinita',
    description: 'Gestiona tu información personal, datos de contacto y configuración de tu cuenta'
  }
}

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return children
}
