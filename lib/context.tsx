import { User } from 'firebase/auth';
import { createContext } from 'react'

type UserContext = {
  user: User,
  username: string
}

export const UserContext = createContext({ user: null, username: null });