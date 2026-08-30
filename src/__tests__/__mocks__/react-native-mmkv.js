// Mock manual do react-native-mmkv para os testes Jest.
//
// A lib v4 detecta o ambiente de teste (JEST_WORKER_ID) e usa uma instância
// mockada dentro de createMMKV(), mas o módulo `getMMKVFactory.js` importa
// `react-native-nitro-modules` no topo do arquivo — fora do branch de teste —
// e essa importação já falha porque o módulo nativo Nitro não existe fora de
// um app real. Este mock substitui o pacote inteiro por uma versão simples,
// em memória, sem tocar em nenhum módulo nativo.

function createMockMMKV(config = { id: 'mmkv.default' }) {
  const storage = new Map();
  const listeners = new Set();

  const notifyListeners = key => {
    listeners.forEach(listener => listener(key));
  };

  return {
    id: config.id,
    get length() {
      return storage.size;
    },
    get byteSize() {
      return JSON.stringify(Array.from(storage.entries())).length;
    },
    get size() {
      return this.byteSize;
    },
    isReadOnly: false,
    isEncrypted: false,
    clearAll: () => {
      const keysBefore = Array.from(storage.keys());
      storage.clear();
      keysBefore.forEach(notifyListeners);
    },
    remove: key => {
      const deleted = storage.delete(key);
      if (deleted) notifyListeners(key);
      return deleted;
    },
    set: (key, value) => {
      if (key === '') throw new Error('Cannot set a value for an empty key!');
      storage.set(key, value);
      notifyListeners(key);
    },
    getString: key => {
      const result = storage.get(key);
      return typeof result === 'string' ? result : undefined;
    },
    getNumber: key => {
      const result = storage.get(key);
      return typeof result === 'number' ? result : undefined;
    },
    getBoolean: key => {
      const result = storage.get(key);
      return typeof result === 'boolean' ? result : undefined;
    },
    getBuffer: key => {
      const result = storage.get(key);
      return result instanceof ArrayBuffer ? result : undefined;
    },
    getAllKeys: () => Array.from(storage.keys()),
    contains: key => storage.has(key),
    recrypt: () => {},
    encrypt: () => {},
    decrypt: () => {},
    trim: () => {},
    checkContentChanged: () => {},
    addOnValueChangedListener: listener => {
      listeners.add(listener);
      return { remove: () => listeners.delete(listener) };
    },
    importAllFrom: other => {
      const keys = other.getAllKeys();
      let imported = 0;
      keys.forEach(key => {
        const data = other.getBuffer(key);
        if (data != null) {
          storage.set(key, data);
          imported++;
        }
      });
      return imported;
    },
  };
}

module.exports = {
  createMMKV: config => createMockMMKV(config),
  existsMMKV: () => false,
  deleteMMKV: () => true,
  useMMKV: () => createMockMMKV(),
  useMMKVBoolean: () => [undefined, () => {}],
  useMMKVBuffer: () => [undefined, () => {}],
  useMMKVNumber: () => [undefined, () => {}],
  useMMKVObject: () => [undefined, () => {}],
  useMMKVString: () => [undefined, () => {}],
  useMMKVListener: () => {},
  useMMKVKeys: () => [],
};
