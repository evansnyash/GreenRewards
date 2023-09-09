// context/authContext.js
import { createContext } from 'react';

const AuthContext = createContext({
  signerr: null,
  signInWithWeb3: () => {},
  isAuthenticated: false
});

export default AuthContext;
