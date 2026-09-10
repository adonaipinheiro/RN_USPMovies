// Traz os globais do Detox (device, element, by, expect, waitFor...) só para
// os arquivos dentro de e2e/ — este pacote tem tsconfig.json próprio,
// isolado do tsconfig raiz, exatamente para não colidir com o `expect` do
// Jest usado nos testes unitários em src/__tests__/.
/// <reference types="detox" />
