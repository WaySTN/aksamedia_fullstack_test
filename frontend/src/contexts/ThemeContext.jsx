import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    // 'light', 'dark', or 'system'
    const [themePreference, setThemePreference] = useLocalStorage('theme_preference', 'system');
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = () => {
            if (themePreference === 'system') {
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setIsDark(systemDark);
                if (systemDark) {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            } else if (themePreference === 'dark') {
                setIsDark(true);
                root.classList.add('dark');
            } else {
                setIsDark(false);
                root.classList.remove('dark');
            }
        };

        applyTheme();

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (themePreference === 'system') {
                applyTheme();
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [themePreference]);

    const setTheme = (theme) => {
        setThemePreference(theme);
    };

    return (
        <ThemeContext.Provider value={{ themePreference, isDark, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
