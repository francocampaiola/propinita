import { Database } from '../types'

export type UserType = Database['public']['Enums']['user_type']
export type StepStatus = Database['public']['Enums']['signup_status']

export interface UserData {
  user_type?: UserType
  first_name?: string
  last_name?: string
  civil_state?: string
  nationality?: string
  phone?: string
  current_step?: StepStatus
  phone_prefix?: string
  birthdate?: string
}

export interface OnboardingStepProps {
  userData: UserData
  onNext: (data: Partial<UserData>) => void
  onBack: () => void
  isLoading: boolean
  isLoadingBack: boolean
}