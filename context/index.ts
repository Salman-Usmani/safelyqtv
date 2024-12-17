import { user } from "@/types";
import React from "react";

export const AuthContext = React.createContext({
  signIn: () => {},
  signOut: () => {},
  signInTV: (email: string, password: string) => {},
});
export const UserInformation = React.createContext({
  userInfo: {} as user | null,
  setUserInfo: (user: user) => {},
});

// import {createContext, ReactNode, useContext, useState} from 'react';
// import {UserData} from '../types';

// interface UserContextType {
//   user: UserData | null;
//   setUser: (user: UserData | null) => void;
//   token: string | null;
//   setToken: (token: string | null) => void;
// }
// interface UserProviderProps {
//   children: ReactNode;
// }

// export const UserContext = createContext<UserContextType>({
//   user: null,
//   setUser: () => null,
//   token: null,
//   setToken: () => null,
// });

// export const useUserContext = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUserContext must be used within a UserProvider');
//   }
//   return context;
// };

// export const UserProvider = ({children}: UserProviderProps) => {
//   const [user, setUser] = useState<UserData | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   return (
//     <UserContext.Provider value={{user, token, setToken, setUser}}>
//       {children}
//     </UserContext.Provider>
//   );
// };
