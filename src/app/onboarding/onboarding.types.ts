import { Database } from '../types'

export type UserType = 'provider'
export type StepStatus = 'user_personal_data' | 'user_bank_data' | 'user_summary' | 'completed'

export interface UserData {
  user_type: UserType
  first_name?: string
  last_name?: string
  civil_state?: string
  nationality?: string
  phone?: string
  current_step?: StepStatus
  phone_prefix?: string
  birthdate?: string
  monthly_goal?: number
}

export interface OnboardingStepProps {
  userData: UserData
  onNext: (data: Partial<UserData>) => void
  onBack: () => void
  isLoading: boolean
  isLoadingBack: boolean
}
