// UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      const usuarioJSON = await AsyncStorage.getItem('userNombre');
      /*
      if (usuarioJSON) {
        const decodedUser = JSON.parse(usuarioJSON);
        setUsuario(decodedUser);
      }
      */
      if (usuarioJSON) {
        setUsuario(JSON.parse(usuarioJSON));
      }
        
    };
    cargarUsuario();
  }, []);

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
};
