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
    input: {
      marginHorizontal: 16,
      marginBottom: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 16,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      fontSize: 15,
    },
    hint: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    hintTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    hintMessage: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    separator: {
      height: 12,
    },
  });
