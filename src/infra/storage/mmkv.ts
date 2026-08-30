// camada: infra — plumbing técnica genérica, não conhece o domínio.
//
// MMKV é síncrono (ao contrário do AsyncStorage) — favoritos e cache podem
// ser lidos/escritos sem await, o que simplifica bastante o repositório.

import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'uspmovies-storage' });

export function getObject<T>(key: string): T | null {
  const raw = storage.getString(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setObject<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}
