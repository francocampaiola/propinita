export interface OnboardingComponent {
  prevStep?: () => Promise<void>
  nextStep: ({ userData }: { userData: any }) => Promise<void>
  loadingPrevStep?: boolean
}
