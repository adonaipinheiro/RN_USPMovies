import { StyleSheet } from 'react-native';
import { ThemeColors } from '@utils/colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 12,
      alignItems: 'flex-start',
    },
    poster: {
      width: 72,
      height: 108,
      borderRadius: 14,
      backgroundColor: colors.border,
    },
    info: {
      flex: 1,
      marginLeft: 12,
      marginRight: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    star: {
      color: colors.star,
      marginRight: 4,
    },
    metaText: {
      color: colors.text,
      fontSize: 13,
    },
    metaTextSecondary: {
      color: colors.textSecondary,
      fontSize: 13,
    },
    overview: {
      marginTop: 4,
      color: colors.textSecondary,
      fontSize: 12,
    },
  });
