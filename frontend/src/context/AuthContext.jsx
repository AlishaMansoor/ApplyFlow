import React from 'react'
export const AuthDataContext = React.createContext();

function AuthContext  ({children}) {
  return (
    <div>
      <AuthDataContext.Provider value={{serverUrl:"http://localhost:3000" }}>
      {children}
      </AuthDataContext.Provider>
    </div>
  )
}

export default AuthContext
//backend server URL being provided everywhere, where it will be imported.through context to be used in frontend components for API calls.