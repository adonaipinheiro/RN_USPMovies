// camada: presentation (navegação) — ponto de entrada público do módulo de
// navegação; o resto do app importa daqui (@presentation/navigation), nunca
// dos arquivos internos diretamente.

export { coordinator } from './navigation';
export { Router } from './router';
