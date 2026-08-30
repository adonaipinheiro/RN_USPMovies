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

  describe('interceptors de log (__DEV__)', () => {
    function requestLogInterceptor() {
      return (api.interceptors.request as unknown as { handlers: Array<{ fulfilled: (c: any) => any }> }).handlers[1]
        .fulfilled;
    }

    function responseLogInterceptor() {
      return (
        api.interceptors.response as unknown as {
          handlers: Array<{ fulfilled: (r: any) => any; rejected: (e: any) => Promise<never> }>;
        }
      ).handlers[0];
    }

    it('loga o método e a URL da requisição quando presentes', () => {
      const config = requestLogInterceptor()({ method: 'post', url: '/movie/popular', params: { page: 1 } });
      expect(config.url).toBe('/movie/popular');
    });

    it('usa "get" e "" como defaults quando method/params estão ausentes', () => {
      const config = requestLogInterceptor()({ url: '/movie/popular' });
      expect(config.url).toBe('/movie/popular');
    });

    it('loga o sucesso e repassa a response adiante', () => {
      const response = responseLogInterceptor().fulfilled({ status: 200, config: { url: '/movie/popular' } });
      expect(response.status).toBe(200);
    });

    it('loga o erro com status/url conhecidos e rejeita a promise', async () => {
      const error = { response: { status: 500 }, config: { url: '/movie/popular' } };
      await expect(responseLogInterceptor().rejected(error)).rejects.toBe(error);
    });

    it('loga o erro com status/url desconhecidos (sem response/config) e rejeita a promise', async () => {
      const error = {};
      await expect(responseLogInterceptor().rejected(error)).rejects.toBe(error);
    });
  });

  it('fora de __DEV__, não registra os interceptors de log', () => {
    const originalDev = (global as { __DEV__?: boolean }).__DEV__;
    (global as { __DEV__?: boolean }).__DEV__ = false;

    let freshApi: typeof api;
    jest.isolateModules(() => {
      freshApi = require('@infra/http/api').api;
    });

    expect((freshApi!.interceptors.request as unknown as { handlers: unknown[] }).handlers).toHaveLength(1);
    expect((freshApi!.interceptors.response as unknown as { handlers: unknown[] }).handlers).toHaveLength(0);

    (global as { __DEV__?: boolean }).__DEV__ = originalDev;
  });
});
