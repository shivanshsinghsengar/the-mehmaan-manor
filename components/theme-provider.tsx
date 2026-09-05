"use client";

import { createContext, useContext, useEffect } from "react";

type Theme = "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

// Always-light theme provider — redesign uses light theme only
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Clear any stored dark preference and lock to light
    localStorage.removeItem("tmm-theme");
    document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}
