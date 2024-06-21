import { unmarshalPrivateKey } from '@libp2p/crypto/keys'
import type { PrivateKey } from '@libp2p/interface'
import bs58 from 'bs58'
import { getClientKey, type ClientKey } from './auth'

export enum WalletType {
  NEAR = 'NEAR',
  ETH = 'ETH'
}

export interface AxiosHeader {
  [key: string]: string
}

export async function createAuthHeader(payload: string): Promise<AxiosHeader | null> {
  const privateKey: PrivateKey | null = await getPrivateKey()

  if (!privateKey) {
    return null
  }

  const encoder = new TextEncoder()
  const contentBuff = encoder.encode(payload)

  const signing_key = bs58.encode(privateKey.public.bytes)

  const hashBuffer = await crypto.subtle.digest('SHA-256', contentBuff)
  const hashArray = new Uint8Array(hashBuffer)

  const signature = await privateKey.sign(hashArray)
  const signatureBase58 = bs58.encode(signature)
  const contentBase58 = bs58.encode(hashArray)

  const headers: AxiosHeader = {
    wallet_type: WalletType.NEAR,
    signing_key: signing_key,
    signature: signatureBase58,
    challenge: contentBase58
  }

  return headers
}

export async function getPrivateKey(): Promise<PrivateKey | null> {
  try {
    const clientKey: ClientKey | null = getClientKey()
    console.log(clientKey)
    if (!clientKey) {
      return null
    }
    return await unmarshalPrivateKey(bs58.decode(clientKey.privateKey))
  } catch (error) {
    console.error('Error extracting private key:', error)
    return null
  }
}
