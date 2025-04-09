import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cobrar | Propinita',
  description: 'Genera códigos QR y enlaces de pago para recibir propinas de tus clientes',
  openGraph: {
    title: 'Cobrar | Propinita',
    description: 'Genera códigos QR y enlaces de pago para recibir propinas de tus clientes'
  }
}

export default function CobrarLayout({ children }: { children: React.ReactNode }) {
  return children
}
