// import { MdOutlineDashboard, MdStore, MdVerifiedUser, MdViewList, MdWallet } from 'react-icons/md'
import { FaHome, FaRegCreditCard, FaUserAlt } from 'react-icons/fa'
import { IoSettings } from 'react-icons/io5'
import { SidebarItems } from './utils.types'

export const sidebarItems: SidebarItems[] = [
  {
    icon: <FaHome />,
    title: 'Inicio',
    path: '/dashboard'
  },
  {
    icon: <FaRegCreditCard />,
    title: 'Cobrar',
    path: '/dashboard/billetera'
  },
  {
    icon: <FaUserAlt />,
    title: 'Mi perfil',
    path: '/dashboard/tiendas'
  },
  {
    icon: <IoSettings />,
    title: 'Ajustes',
    path: '/dashboard/usuarios'
  }
]
