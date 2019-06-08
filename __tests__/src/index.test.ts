import { Options } from '~/Options';
import { ServiceEndpoint } from '~/ServiceEndpoint';

import ApiMapper from '~/index';
import apiConfig = require('../fixture/api.config.test');

// axios settings
jest.mock('axios');
import axios from 'axios';

const postData = require('../fixture/data/wp/v2/posts.json') as any;
(axios.get as any).mockResolvedValue({ data: postData });

let apiMapper1: ApiMapper;
const option1: Options = apiConfig;

describe('ApiMapper', (): void => {
  beforeAll((): void => {
    apiMapper1 = new ApiMapper(option1);
  });

  describe('ClientOptions', (): void => {
    it('should contain array', (): void => {
      expect(option1.baseURI).toBe('../data');
    });
  });

  describe('ApiMapper', (): void => {
    it('getServiceEndpoint() return ServiceEndpoint', (): void => {
      const [method, endpoint]: [string, string] = ['get', '/posts'];
      const serviceEndpoint: ServiceEndpoint = apiMapper1.getServiceEndpoint({
        method,
        endpoint
      });
      expect(serviceEndpoint.name).toBe('post');
      expect(serviceEndpoint.path).toBe('/wp/v2/posts.json');
      expect(serviceEndpoint.error).toBeUndefined();
    });
    it('getServiceEndpoint() with wrong path return error', (): void => {
      const [method, endpoint]: [string, string] = ['get', '/error-path'];
      const serviceEndpoint: ServiceEndpoint = apiMapper1.getServiceEndpoint({
        method,
        endpoint
      });
      expect(serviceEndpoint.error).toBe(
        `This method "${method}" or this endpoint "${endpoint}" does'nt be found`
      );
      expect(serviceEndpoint.path).toBeUndefined();
      expect(serviceEndpoint.path).toBeUndefined();
    });

    it('get() should return post json with normal', async (): Promise<void> => {
      const [endpoint, params]: [string, object] = ['/posts', {}];
      const res = await apiMapper1.get({ endpoint, params });
      expect(res['data']).toBe(postData);
      expect(res['error']).toBeUndefined;
    });

    it('get() should return post json with error', async (): Promise<void> => {
      const [endpoint, params]: [string, object] = ['/error-posts-path', {}];
      const res = await apiMapper1.get({ endpoint, params });
      expect(res['data']).toBeUndefined;
      expect(res['error']).toBe(
        `This method "get" or this endpoint "${endpoint}" does'nt be found`
      );
    });
  });
});
