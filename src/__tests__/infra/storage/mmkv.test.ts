// react-native-mmkv detecta o ambiente Jest (JEST_WORKER_ID) e devolve
// automaticamente uma instância mockada em memória — não precisamos mockar
// nada manualmente aqui.

import { getObject, setObject, storage } from '@infra/storage/mmkv';

describe('mmkv storage helpers', () => {
  beforeEach(() => {
    storage.clearAll();
  });

  it('getObject retorna null quando a chave não existe', () => {
    expect(getObject('inexistente')).toBeNull();
  });

  it('setObject/getObject fazem round-trip de um objeto', () => {
    setObject('key', { a: 1, b: [1, 2, 3] });
    expect(getObject('key')).toEqual({ a: 1, b: [1, 2, 3] });
  });

  it('getObject retorna null quando o conteúdo salvo não é JSON válido', () => {
    storage.set('key', 'não-é-json{{{');
    expect(getObject('key')).toBeNull();
  });
});
