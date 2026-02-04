import React, { useState, useEffect } from 'react';
import { ThemeContext } from './themeContext';

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // If no saved preference, use system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
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
