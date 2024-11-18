import React, { createContext, useContext, useState } from 'react';

// Define os dois temas
const themes = {
  dark: {
    background: '#1b1b1b',
    color: '#f0f0f0',
    buttonBackground: '#ff4500',
    buttonColor: '#fff',
  },
  light: {
    background: '#f9f9f9',
    color: '#1b1b1b',
    buttonBackground: '#007bff',
    buttonColor: '#fff',
  },
};

// Cria o contexto do tema
const ThemeContext = createContext();

// Provedor de tema
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes.dark);

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) =>
      prevTheme === themes.dark ? themes.light : themes.dark
    );
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para acessar o tema
export const useTheme = () => useContext(ThemeContext);