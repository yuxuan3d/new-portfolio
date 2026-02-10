import React, { useEffect, useRef, useState } from 'react';
import { ThemeContext } from './themeContext';

export const ThemeProvider = ({ children }) => {
  const transitionTimeoutRef = useRef(null);
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

    // Keep the root element in sync to avoid theme flash on first paint.
    document.documentElement.style.backgroundColor = isDarkMode ? '#060C1A' : '#DDE4E4';
    document.documentElement.style.color = isDarkMode ? '#D8E3F4' : '#001B1A';
  }, [isDarkMode]);

  useEffect(() => () => {
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.dataset.themeTransition = 'true';

    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = window.setTimeout(() => {
      delete root.dataset.themeTransition;
      transitionTimeoutRef.current = null;
    }, 300);

    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
