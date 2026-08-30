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
  });
