import { renderHook, act } from '@testing-library/react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { useThemeStore } from '@store/useThemeStore';
import { darkColors, lightColors } from '@utils/colors';

describe('useAppTheme', () => {
  beforeEach(() => {
    useThemeStore.setState({ mode: 'system' });
  });

  it('modo "light" força tema claro independentemente do sistema', async () => {
    useThemeStore.setState({ mode: 'light' });

    const { result } = await renderHook(() => useAppTheme());

    expect(result.current.dark).toBe(false);
    expect(result.current.colors).toBe(lightColors);
  });

  it('modo "dark" força tema escuro independentemente do sistema', async () => {
    useThemeStore.setState({ mode: 'dark' });

    const { result } = await renderHook(() => useAppTheme());

    expect(result.current.dark).toBe(true);
    expect(result.current.colors).toBe(darkColors);
  });

  it('modo "system" delega para o color scheme do dispositivo', async () => {
    useThemeStore.setState({ mode: 'system' });

    const { result } = await renderHook(() => useAppTheme());

    expect(result.current.mode).toBe('system');
    expect(typeof result.current.dark).toBe('boolean');
  });

  it('setMode atualiza o modo global (compartilhado por todo o app)', async () => {
    const { result } = await renderHook(() => useAppTheme());

    act(() => {
      result.current.setMode('dark');
    });

    expect(useThemeStore.getState().mode).toBe('dark');
  });
});
