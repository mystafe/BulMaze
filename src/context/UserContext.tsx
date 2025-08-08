'use client';

/* User information stored with React Context and useReducer. */

import { createContext, useContext, useReducer, type ReactNode } from 'react';

interface UserState {
  name: string;
  isLoggedIn: boolean;
}

type UserAction =
  | { type: 'LOGIN'; name: string }
  | { type: 'LOGOUT' };

const initialState: UserState = {
  name: '',
  isLoggedIn: false,
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'LOGIN':
      return { name: action.name, isLoggedIn: true };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
} | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return context;
}

