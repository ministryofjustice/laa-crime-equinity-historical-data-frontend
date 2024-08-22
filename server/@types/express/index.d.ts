import { SearchResult } from '@searchEform'
import type { UserDetails } from '../../services/userService'

export default {}

interface PkceCodes {
  verifier: string
  challenge: string
  challengeMethod: string
}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    history: string[]
    searchResults: SearchResult[]
    formValues: Record<string, string>
    errors?: Record<string, { text: string }>
    errorSummary?: Array<{ href: string; text: string }>
    successMessage?: string
    downloadUrl?: string
    csvContent?: string
    pkceCodes: PkceCodes
    authCodeUrlRequest: AuthorizationUrlRequest
    authCodeRequest: AuthorizationCodeRequest
    tokenCache: string
    account: AccountInfo
    accessToken: string
    idToken: string
    isAuthenticated: boolean
    paging: {
      itemsTotal: number
      number: number
      total: number
    }
  }
}

export declare global {
  namespace Express {
    interface User extends Partial<UserDetails> {
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
    }

    interface Locals {
      user: Express.User
    }
  }
}
