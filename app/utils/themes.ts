import type { Theme } from '~/types/theme'

export const themes: Theme[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    light: {
      primary: 'rgb(139, 92, 246)',   // Purple
      secondary: 'rgb(236, 72, 153)',  // Pink
      background: 'rgb(250, 250, 250)',
      surface: 'rgb(255, 255, 255)',
      text: 'rgb(17, 24, 39)',
      textMuted: 'rgb(107, 114, 128)',
      border: 'rgb(229, 231, 235)'
    },
    dark: {
      primary: 'rgb(167, 139, 250)',
      secondary: 'rgb(244, 114, 182)',
      background: 'rgb(17, 24, 39)',
      surface: 'rgb(31, 41, 55)',
      text: 'rgb(243, 244, 246)',
      textMuted: 'rgb(156, 163, 175)',
      border: 'rgb(55, 65, 81)'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    light: {
      primary: 'rgb(59, 130, 246)',    // Blue
      secondary: 'rgb(6, 182, 212)',   // Cyan
      background: 'rgb(248, 250, 252)',
      surface: 'rgb(255, 255, 255)',
      text: 'rgb(15, 23, 42)',
      textMuted: 'rgb(100, 116, 139)',
      border: 'rgb(226, 232, 240)'
    },
    dark: {
      primary: 'rgb(96, 165, 250)',
      secondary: 'rgb(34, 211, 238)',
      background: 'rgb(15, 23, 42)',
      surface: 'rgb(30, 41, 59)',
      text: 'rgb(241, 245, 249)',
      textMuted: 'rgb(148, 163, 184)',
      border: 'rgb(51, 65, 85)'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    light: {
      primary: 'rgb(251, 146, 60)',    // Orange
      secondary: 'rgb(250, 204, 21)',  // Yellow
      background: 'rgb(255, 251, 235)',
      surface: 'rgb(255, 255, 255)',
      text: 'rgb(28, 25, 23)',
      textMuted: 'rgb(120, 113, 108)',
      border: 'rgb(231, 229, 228)'
    },
    dark: {
      primary: 'rgb(253, 186, 116)',
      secondary: 'rgb(252, 211, 77)',
      background: 'rgb(28, 25, 23)',
      surface: 'rgb(41, 37, 36)',
      text: 'rgb(245, 245, 244)',
      textMuted: 'rgb(168, 162, 158)',
      border: 'rgb(68, 64, 60)'
    }
  },
  {
    id: 'forest',
    name: 'Forest',
    light: {
      primary: 'rgb(34, 197, 94)',     // Green
      secondary: 'rgb(168, 85, 247)',  // Purple
      background: 'rgb(247, 254, 231)',
      surface: 'rgb(255, 255, 255)',
      text: 'rgb(20, 28, 16)',
      textMuted: 'rgb(87, 96, 83)',
      border: 'rgb(217, 229, 209)'
    },
    dark: {
      primary: 'rgb(74, 222, 128)',
      secondary: 'rgb(196, 181, 253)',
      background: 'rgb(20, 28, 16)',
      surface: 'rgb(31, 41, 27)',
      text: 'rgb(240, 253, 244)',
      textMuted: 'rgb(134, 160, 139)',
      border: 'rgb(47, 61, 43)'
    }
  }
]

export function getThemeById(id: string): Theme | undefined {
  return themes.find(theme => theme.id === id)
}

export function getThemeStyles(theme: Theme, isDark: boolean) {
  const colors = isDark ? theme.dark : theme.light
  
  return {
    '--theme-primary': colors.primary,
    '--theme-secondary': colors.secondary,
    '--theme-background': colors.background,
    '--theme-surface': colors.surface,
    '--theme-text': colors.text,
    '--theme-text-muted': colors.textMuted,
    '--theme-border': colors.border,
  }
}