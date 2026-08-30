import { Platform } from 'react-native';
import { Theme } from '@react-navigation/native';
import { useAppTheme } from '@hooks/useAppTheme';

export function useAppNavigationTheme(): Theme {
  const { dark, colors } = useAppTheme();

  return {
    dark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.notification,
    },
    fonts: Platform.select({
      ios: {
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: '600' },
        heavy: { fontFamily: 'System', fontWeight: '700' },
      },
      default: {
        regular: { fontFamily: 'sans-serif', fontWeight: 'normal' },
        medium: { fontFamily: 'sans-serif-medium', fontWeight: 'normal' },
        bold: { fontFamily: 'sans-serif', fontWeight: '600' },
        heavy: { fontFamily: 'sans-serif', fontWeight: '700' },
      },
    })!,
  };
}
