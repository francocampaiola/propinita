import { MdOutlineDashboard, MdStore, MdVerifiedUser, MdViewList, MdWallet } from 'react-icons/md'
import { SidebarItems } from './utils.types'

export const sidebarItems: SidebarItems[] = [
  {
    icon: <MdOutlineDashboard />,
    title: 'Inicio',
    path: '/dashboard'
  },
  {
    icon: <MdWallet />,
    title: 'Cobrar',
    path: '/dashboard/billetera'
  },
  {
    icon: <MdStore />,
    title: 'Mi perfil',
    path: '/dashboard/tiendas'
  },
  {
    icon: <MdVerifiedUser />,
    title: 'Ajustes',
    path: '/dashboard/usuarios'
  }
]
