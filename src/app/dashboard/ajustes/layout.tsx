import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ajustes | Propinita',
  description:
    'Configura tus métodos de pago, cambia tu contraseña y gestiona las preferencias de tu cuenta',
  openGraph: {
    title: 'Ajustes | Propinita',
    description:
      'Configura tus métodos de pago, cambia tu contraseña y gestiona las preferencias de tu cuenta'
  }
}

export default function AjustesLayout({ children }: { children: React.ReactNode }) {
  return children
}
