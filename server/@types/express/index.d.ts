import { SearchResult } from '@searchEform'
import type { UserDetails } from '../../services/userService'

export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    history: string[]
    searchResults: SearchResult[]
    formValues: Record<string, string>
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
