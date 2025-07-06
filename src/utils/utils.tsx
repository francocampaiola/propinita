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
    path: '/dashboard/cobrar'
  },
  {
    icon: <FaUserAlt />,
    title: 'Mi perfil',
    path: '/dashboard/perfil'
  },
  {
    icon: <IoSettings />,
    title: 'Ajustes',
    path: '/dashboard/ajustes'
  }
]

interface GoalProgress {
  percentage: number
  isCompleted: boolean
}

export const calculateMonthlyGoalPercentage = (
  monthlyGoal: number | null,
  transactions: Array<{ amount: number | null; created_at: string; status: string }>
): GoalProgress => {
  if (!monthlyGoal || monthlyGoal <= 0) {
    return { percentage: 100, isCompleted: true }
  }

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const currentMonthTotal = transactions.reduce((total, transaction) => {
    const transactionDate = new Date(transaction.created_at)
    if (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear &&
      transaction.status === 'completed' &&
      transaction.amount
    ) {
      return total + transaction.amount
    }
    return total
  }, 0)

  const percentage = Math.round((currentMonthTotal / monthlyGoal) * 100)
  return {
    percentage: Math.min(percentage, 100),
    isCompleted: currentMonthTotal >= monthlyGoal
  }
}

/**
 * Función para copiar texto al portapapeles con compatibilidad para navegadores móviles
 * @param text - El texto a copiar
 * @returns Promise<boolean> - true si se copió exitosamente, false en caso contrario
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Intentar usar la API moderna del portapapeles
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }

    // Fallback para navegadores que no soportan la API moderna
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)

    return successful
  } catch (error) {
    console.error('Error al copiar al portapapeles:', error)
    return false
  }
}
