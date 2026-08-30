// Wrapper de QueryClientProvider compartilhado por todo teste que renderiza
// um hook ou tela dependente do React Query, usado via:
//
//   const { result } = await renderHook(() => usePopular(), {
//     wrapper: createQueryClientWrapper(),
//   });
//
// ou, renderizando uma tela diretamente:
//
//   const Wrapper = createQueryClientWrapper();
//   await render(<Wrapper><PopularScreen /></Wrapper>);
//
// `retry: false` evita que um erro simulado dispare retries reais e deixe o
// teste lento/instável. Cada chamada cria um QueryClient novo — instâncias
// não devem ser compartilhadas entre testes.

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function createQueryClientWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
