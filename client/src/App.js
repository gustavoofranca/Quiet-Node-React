import React, { useEffect } from 'react';
import AppRouter from './router';
import { useTheme } from './context/ThemeContext';

function App() {
  const { currentTheme } = useTheme(); // O tema atual

  useEffect(() => {
    // Atualiza a classe no body dependendo do tema
    document.body.className = currentTheme; // "light" ou "dark"
  }, [currentTheme]);

  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;