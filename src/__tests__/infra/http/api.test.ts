import { api } from '@infra/http/api';

describe('api (instância axios da TMDB)', () => {
  it('usa a baseURL da TMDB', () => {
    expect(api.defaults.baseURL).toBe('https://api.themoviedb.org/3');
  });

  it('o interceptor de request anexa o header Authorization Bearer', () => {
    const requestInterceptor = (api.interceptors.request as unknown as { handlers: Array<{ fulfilled: (c: any) => any }> })
      .handlers[0];

    const config = requestInterceptor.fulfilled({ headers: {} } as any);

    expect(config.headers.Authorization).toMatch(/^Bearer /);
  });
});
