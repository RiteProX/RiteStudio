/**
 * RitemastaPro — Theme Context
 * Dark mode is DEFAULT. Three light theme variants available.
 * Font size toggle: normal / large / xl
 * All preferences persisted to localStorage.
 */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type LightTheme = "warm" | "slate" | "pure";
export type FontSize = "normal" | "large" | "xl";

interface ThemeContextType {
  darkMode: boolean;
  lightTheme: LightTheme;
  fontSize: FontSize;
  toggleDarkMode: () => void;
  setLightTheme: (t: LightTheme) => void;
  setFontSize: (s: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: true,
  lightTheme: "warm",
  fontSize: "normal",
  toggleDarkMode: () => {},
  setLightTheme: () => {},
  setFontSize: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("rm_darkMode");
    return saved !== null ? saved === "true" : true; // dark is default
  });

  const [lightTheme, setLightThemeState] = useState<LightTheme>(() => {
    return (localStorage.getItem("rm_lightTheme") as LightTheme) || "warm";
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem("rm_fontSize") as FontSize) || "normal";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      root.classList.remove("light-warm", "light-slate", "light-pure");
    } else {
      root.classList.remove("dark");
      root.classList.add(`light-${lightTheme}`);
    }
    localStorage.setItem("rm_darkMode", String(darkMode));
  }, [darkMode, lightTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("font-normal", "font-large", "font-xl");
    root.classList.add(`font-${fontSize}`);
    localStorage.setItem("rm_fontSize", fontSize);
  }, [fontSize]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const setLightTheme = (t: LightTheme) => {
    setLightThemeState(t);
    localStorage.setItem("rm_lightTheme", t);
  };

  const setFontSize = (s: FontSize) => {
    setFontSizeState(s);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, lightTheme, fontSize, toggleDarkMode, setLightTheme, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
