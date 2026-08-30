import { useThemeStore } from '@store/useThemeStore';
import { storage } from '@infra/storage/mmkv';

describe('useThemeStore', () => {
  beforeEach(() => {
    storage.clearAll();
    useThemeStore.setState({ mode: 'system' });
  });

  it('começa no modo "system" por padrão', () => {
    expect(useThemeStore.getState().mode).toBe('system');
  });

  it('setMode atualiza o estado e persiste no MMKV', () => {
    useThemeStore.getState().setMode('dark');

    expect(useThemeStore.getState().mode).toBe('dark');
    expect(storage.getString('theme-mode')).toBe(JSON.stringify('dark'));
  });
});
