export interface Onboarding {
  user_type?: 'user' | 'provider', 
  user_data?: {
    id?: number,
    first_name?: string,
    last_name?: string,
    civil_state?: string,
    nationality?: string,
    phone?: string,
    signup_status?: SignupStatus
  },
  bank?: {
    cbu_cvu?: string,
    details?: string
  }
}

export interface SignupStatus {
  signup_status?: {
    user_type: string
    user_personal_data: string
    user_bank_data: string
    user_summary: string
    completed: string
  }
}

export interface OnboardingComponent {
  userData: Onboarding
  prevStep?: () => Promise<void>
  nextStep: ({ userData }: { userData?: any }) => Promise<void>
  loadingPrevStep?: boolean
}
