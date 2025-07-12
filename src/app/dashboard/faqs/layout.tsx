import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Centro de ayuda | Propinita',
  description:
    'Encuentra respuestas a las preguntas más frecuentes sobre Propinita y cómo usar la plataforma',
  openGraph: {
    title: 'Centro de ayuda | Propinita',
    description:
      'Encuentra respuestas a las preguntas más frecuentes sobre Propinita y cómo usar la plataforma'
  }
}

export default function FaqsLayout({ children }: { children: React.ReactNode }) {
  return children
}
