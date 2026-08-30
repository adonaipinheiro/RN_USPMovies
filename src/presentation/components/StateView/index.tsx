// camada: presentation — renderiza loading/data/empty/error de forma
// padronizada em todas as telas de dados.

import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { Button } from '@presentation/components/Button';
import { UiState } from '@presentation/state/uiState';
import { createStyles } from './styles';

interface StateViewProps<T> {
  state: UiState<T>;
  // Opcional: telas sem uma ação de retry real (ex.: Favoritos, que só lê o
  // estado local e nunca entra em 'error') simplesmente não passam a prop —
  // em vez de forçar um callback vazio só para satisfazer o tipo.
  onRetry?: () => void;
  emptyMessage?: string;
  children: (value: T) => React.ReactNode;
}

export function StateView<T>({ state, onRetry, emptyMessage, children }: StateViewProps<T>) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  if (state.type === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (state.type === 'data') {
    return <>{children(state.value)}</>;
  }

  if (state.type === 'empty') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Nada por aqui</Text>
        <Text style={styles.message}>{emptyMessage ?? 'Não há filmes para mostrar no momento.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Não foi possível carregar</Text>
      <Text style={styles.message}>{state.message}</Text>
      {onRetry ? (
        <View style={styles.retryButton}>
          <Button label="Tentar novamente" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}
