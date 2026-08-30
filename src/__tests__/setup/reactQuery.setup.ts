// O React Query agenda suas notificações de estado via setTimeout/scheduler
// interno, fora de qualquer act() do React — o que gera avisos de "não
// wrapado em act()" e resultados desatualizados nos testes. Este setup
// (recomendado pela própria documentação do TanStack Query para testes)
// faz as notificações rodarem de forma síncrona.

import { notifyManager } from '@tanstack/query-core';

notifyManager.setNotifyFunction(fn => fn());
notifyManager.setBatchNotifyFunction(fn => fn());
