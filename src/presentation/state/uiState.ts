// camada: presentation — estados de UI explícitos (loading/data/empty/error).

export type UiState<T> =
  | { type: 'loading' }
  | { type: 'data'; value: T }
  | { type: 'empty' }
  | { type: 'error'; message: string };
