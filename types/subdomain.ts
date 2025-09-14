export interface ISubdomain {
  slug: string
  title: string
  content: string
  gifUrl: string
  theme?: string
  isDarkMode?: boolean
  createdAt?: Date | string
  views?: number
}

export interface SubdomainFormData {
  slug: string
  title: string
  content: string
  gifUrl: string
  theme: string
  isDarkMode: boolean
}

export interface SubdomainResponse extends ISubdomain {
  _id?: string
  updatedAt?: Date | string
}