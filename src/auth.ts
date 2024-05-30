import { LocalStorage } from 'quasar'

export interface ClientKey {
  privateKey: string
  publicKey: string
}

export const isAuthenticated = () => {
  if (!LocalStorage.hasItem('node-authorized')) {
    return false
  }

  return LocalStorage.getItem('node-authorized')
}

export const getClientKey = (): ClientKey | null => {
  const keyStr: string | null = LocalStorage.getItem('client-key')
  if (keyStr) {
    return JSON.parse(keyStr)
  }
  return null
}
