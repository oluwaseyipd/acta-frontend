import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";
import { useUIStore, ThemePreset } from "@/store/ui-store";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const themeClassMap: Record<ThemePreset, string> = {
  midnight: "",
  forest: "theme-forest",
  sunset: "theme-sunset",
  lavender: "theme-lavender",
  nordic: "theme-nordic",
  cyberpunk: "theme-cyberpunk",
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { themePreset, colorMode } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    Object.values(themeClassMap).forEach((className) => {
      if (className) {
        root.classList.remove(className);
      }
    });

    // Add current theme class
    const themeClass = themeClassMap[themePreset];
    if (themeClass) {
      root.classList.add(themeClass);
    }
  }, [themePreset]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={colorMode}
      enableSystem={colorMode === "system"}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
