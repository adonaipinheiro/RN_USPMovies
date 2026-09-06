import { coordinator } from '@presentation/navigation/navigation/coordinator';
import { navigation } from '@presentation/navigation/navigation/navigation';

jest.mock('@presentation/navigation/navigation/navigation', () => ({
  navigation: require('@mocks/navigationServiceMock').createNavigationServiceMock(),
}));

const mockedNavigation = navigation as unknown as { push: jest.Mock; goBack: jest.Mock };

describe('coordinator', () => {
  it('gotToDetail navega para a rota Detail com o movieId', () => {
    coordinator.gotToDetail(7);
    expect(mockedNavigation.push).toHaveBeenCalledWith('Detail', { movieId: 7 });
  });

  it('goBack delega para navigation.goBack', () => {
    coordinator.goBack();
    expect(mockedNavigation.goBack).toHaveBeenCalledTimes(1);
  });
});
