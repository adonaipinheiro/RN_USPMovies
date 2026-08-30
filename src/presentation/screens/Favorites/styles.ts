import { StyleSheet } from 'react-native';
import { ThemeColors } from '@utils/colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 32,
      fontWeight: '800',
      color: colors.text,
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 8,
    },
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    separator: {
      height: 12,
    },
    themeRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    themeOption: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    themeOptionActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    themeOptionText: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '600',
    },
    themeOptionTextActive: {
      color: '#FFFFFF',
    },
  });
