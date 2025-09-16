import type { FlashpageFormData } from '~/types'

export interface WizardStep {
  id: string
  title: string
  description: string
  icon: string
  validated: boolean
}

export const useFlashpageWizard = () => {
  const currentStep = useState('wizard-step', () => 0)
  const isLoading = useState('wizard-loading', () => false)
  const submitError = useState<string | null>('wizard-error', () => null)

  const formData = useState<FlashpageFormData>('wizard-form', () => ({
    slug: '',
    title: '',
    content: '',
    gifUrl: '',
    theme: 'aurora',
    isDarkMode: false
  }))

  const steps: WizardStep[] = [
    {
      id: 'basic',
      title: 'Basic Info',
      description: 'Choose your subdomain and title',
      icon: 'i-lucide-globe',
      validated: false
    },
    {
      id: 'content',
      title: 'Content',
      description: 'Add your message and GIF',
      icon: 'i-lucide-message-square',
      validated: false
    },
    {
      id: 'visuals',
      title: 'Theme',
      description: 'Choose colors and style',
      icon: 'i-lucide-palette',
      validated: false
    },
    {
      id: 'preview',
      title: 'Preview',
      description: 'Review and submit',
      icon: 'i-lucide-eye',
      validated: true
    }
  ]

  const validateStep = (stepIndex: number): boolean => {
    const data = formData.value

    switch (stepIndex) {
      case 0: // Basic Info
        return !!(
          data.slug &&
          data.slug.length >= 3 &&
          data.slug.length <= 50 &&
          /^[a-z0-9-]+$/.test(data.slug) &&
          data.title &&
          data.title.length <= 100
        )
      case 1: // Content & GIF
        return !!(data.content && data.content.length <= 1000)
      case 2: // Visuals (Theme only now)
        return true // Theme always has a default value
      case 3: // Preview
        return true
      default:
        return false
    }
  }

  const canProceed = computed(() => validateStep(currentStep.value))

  const nextStep = () => {
    if (canProceed.value && currentStep.value < steps.length - 1) {
      currentStep.value++
    }
  }

  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
      submitError.value = null
    }
  }

  const goToStep = (index: number) => {
    // Can only go to previous steps or current step
    if (index <= currentStep.value) {
      currentStep.value = index
      submitError.value = null
    }
  }

  const checkAvailability = async (slug: string): Promise<boolean> => {
    if (!slug || slug.length < 3) return false

    try {
      const response = await $fetch(`/api/flashpages/check/${slug}`)
      return response.available
    } catch {
      return false
    }
  }

  const submitForm = async () => {
    isLoading.value = true
    submitError.value = null

    try {
      const response = await $fetch('/api/flashpages', {
        method: 'POST',
        body: formData.value
      })

      if (response.success) {
        return response.flashpage
      }
      throw new Error('Failed to create flashpage')
    } catch (error: any) {
      submitError.value = error.data?.statusMessage || 'An error occurred while creating your flashpage'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const resetWizard = () => {
    currentStep.value = 0
    formData.value = {
      slug: '',
      title: '',
      content: '',
      gifUrl: '',
      theme: 'aurora',
      isDarkMode: false
    }
    submitError.value = null
    isLoading.value = false
  }

  return {
    currentStep: readonly(currentStep),
    formData,
    steps,
    isLoading: readonly(isLoading),
    submitError: readonly(submitError),
    canProceed,
    nextStep,
    prevStep,
    goToStep,
    validateStep,
    checkAvailability,
    submitForm,
    resetWizard
  }
}