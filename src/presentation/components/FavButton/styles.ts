import { StyleSheet } from 'react-native';
import { ThemeColors } from '@utils/colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    button: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      fontSize: 22,
      color: colors.textSecondary,
    },
    iconActive: {
      color: colors.favorite,
    },
  });
