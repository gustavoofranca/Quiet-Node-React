import React, { createContext, useContext, useState, useEffect } from 'react';

// Criando o contexto de tema
const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    // Recupera o tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    } else {
      // Se não houver, usa o tema claro como padrão
      setCurrentTheme('light');
    }
  }, []);

  useEffect(() => {
    // Salva o tema no localStorage
    localStorage.setItem('theme', currentTheme);
    document.body.className = currentTheme;
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const theme = {
    light: {
      background: '#f9f9f9',
      color: '#000',
    },
    dark: {
      background: '#171717',
      color: '#fff',
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
