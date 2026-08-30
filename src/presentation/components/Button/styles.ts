import { StyleSheet } from 'react-native';
import { ThemeColors } from '@utils/colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      borderRadius: 24,
      overflow: 'hidden',
      alignSelf: 'center',
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: {
      opacity: 0.7,
    },
    label: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 15,
    },
  });
