import { useColorScheme } from 'react-native';
import { useThemeStore, ThemeMode } from '@store/useThemeStore';
import { darkColors, lightColors, ThemeColors } from '@utils/colors';

export interface AppTheme {
  dark: boolean;
  colors: ThemeColors;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export function useAppTheme(): AppTheme {
  const systemScheme = useColorScheme();
  const mode = useThemeStore(state => state.mode);
  const setMode = useThemeStore(state => state.setMode);

  const dark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

  return {
    dark,
    colors: dark ? darkColors : lightColors,
    mode,
    setMode,
  };
}
