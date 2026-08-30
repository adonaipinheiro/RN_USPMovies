// camada: presentation — navegação desacoplada: a tela chama
// coordinator.gotToDetail(id), sem conhecer o React Navigation por baixo.

import { navigation } from './navigation';
import { MainStackScreenNames } from '../stack/MainStack.routes';

const mainCoordinator = {
  gotToDetail: (movieId: number) => navigation.push(MainStackScreenNames.Detail, { movieId }),
};

export const coordinator = {
  ...mainCoordinator,
  goBack: () => navigation.goBack(),
};
