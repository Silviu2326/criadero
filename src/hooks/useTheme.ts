type Theme = 'light';

export function useTheme() {
  return {
    theme: 'light' as Theme,
    setTheme: () => {},
    isDark: false,
    toggleTheme: () => {},
  };
}
