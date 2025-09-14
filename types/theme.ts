export interface ThemeColors {
  primary: string
  secondary: string
  background: string
  surface: string
  text: string
  textMuted: string
  border: string
}

export interface Theme {
  id: string
  name: string
  light: ThemeColors
  dark: ThemeColors
}

export interface ThemeSettings {
  theme: string
  isDarkMode: boolean
}