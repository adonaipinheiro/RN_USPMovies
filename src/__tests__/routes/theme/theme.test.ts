import { renderHook } from '@testing-library/react-native';
import { useAppNavigationTheme } from '@routes/theme';
import { useThemeStore } from '@store/useThemeStore';

describe('useAppNavigationTheme', () => {
  it('monta um Theme do React Navigation coerente com o modo claro', async () => {
    useThemeStore.setState({ mode: 'light' });
    const { result } = await renderHook(() => useAppNavigationTheme());

    expect(result.current.dark).toBe(false);
    expect(result.current.colors.background).toBeDefined();
    expect(result.current.fonts.regular.fontFamily).toBeDefined();
  });

  it('reflete o modo escuro', async () => {
    useThemeStore.setState({ mode: 'dark' });
    const { result } = await renderHook(() => useAppNavigationTheme());

    expect(result.current.dark).toBe(true);
  });
});
