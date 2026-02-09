import React, { useState, useEffect } from 'react';
import { ThemeContext } from './themeContext';

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Respect saved choice first.
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }

    // Default to dark when no preference has been saved yet.
    return true;
  });

  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';

    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);

    // Improve UA defaults (form controls, scrollbars, etc.)
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    // Keep the root element in sync (prevents “flash” on overscroll/background)
    document.documentElement.style.backgroundColor = isDarkMode ? '#1a1a1a' : '#fafafa';
    document.documentElement.style.color = isDarkMode ? '#ffffff' : '#333333';
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 
