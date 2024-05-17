import { AuthorizationUrlRequest } from '@azure/msal-node/src/request/AuthorizationUrlRequest'
import { AuthorizationCodeRequest } from '@azure/msal-node/src/request/AuthorizationCodeRequest'
import { AccountInfo } from '@azure/msal-node'
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
    pkceCodes: PkceCodes
    authCodeUrlRequest: AuthorizationUrlRequest
    authCodeRequest: AuthorizationCodeRequest
    tokenCache: string
    account: AccountInfo
    accessToken: string
    idToken: string
    isAuthenticated: boolean
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
