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
      document.body.classList.add(savedTheme); // Adiciona a classe no body
    } else {
      // Se não houver, usa o tema claro como padrão
      setCurrentTheme('light');
      document.body.classList.add('light'); // Adiciona a classe light por padrão
    }
  }, []);

  useEffect(() => {
    // Salva o tema no localStorage e atualiza o body
    localStorage.setItem('theme', currentTheme);
    document.body.classList.remove('light', 'dark'); // Remove qualquer classe existente
    document.body.classList.add(currentTheme); // Adiciona a classe do tema atual
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
