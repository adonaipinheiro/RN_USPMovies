import { StyleSheet } from 'react-native';
import { ThemeColors } from '@utils/colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    backButton: {
      fontSize: 16,
      color: colors.primary,
      padding: 8,
      fontWeight: '600',
    },
    content: {
      paddingBottom: 32,
    },
    poster: {
      width: '100%',
      height: 420,
    },
    infoCard: {
      marginHorizontal: 16,
      marginTop: -40,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 16,
    },
    movieTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
    },
    star: {
      color: colors.star,
      marginRight: 4,
    },
    metaText: {
      color: colors.text,
      fontSize: 14,
    },
    metaTextSecondary: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    genresRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      marginTop: 16,
      gap: 8,
    },
    genreChip: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    genreText: {
      color: colors.text,
      fontSize: 13,
    },
    overview: {
      marginTop: 16,
      marginHorizontal: 16,
      color: colors.text,
      fontSize: 15,
      lineHeight: 22,
    },
  });
