import React from 'react'
export const AuthDataContext = React.createContext();

function AuthContext  ({children}) {
  const serverUrl = import.meta.env.VITE_SERVER_URL || "https://applyflowbackend.onrender.com";
  return (
    
      <AuthDataContext.Provider value={{ serverUrl }}>
      {children}
      </AuthDataContext.Provider>
    
  )
}

export default AuthContext
//backend server URL being provided everywhere, where it will be imported.through context to be used in frontend components for API calls.