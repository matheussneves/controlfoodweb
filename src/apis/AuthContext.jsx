import { createContext, useState, useContext } from 'react';

// Cria o contexto
const AuthContext = createContext();

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  const [userid, setUserId] = useState(null);

  return (
    <AuthContext.Provider value={{ userid, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useAuth = () => useContext(AuthContext);
