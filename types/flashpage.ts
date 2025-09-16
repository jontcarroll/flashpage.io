export interface IFlashpage {
  slug: string
  title: string
  content: string
  gifUrl: string
  theme?: string
  isDarkMode?: boolean
  createdAt?: Date | string
  views?: number
}

export interface FlashpageFormData {
  slug: string
  title: string
  content: string
  gifUrl: string
  theme: string
  isDarkMode: boolean
}

export interface FlashpageResponse extends IFlashpage {
  _id?: string
  updatedAt?: Date | string
}