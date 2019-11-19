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
    describe('getProps()', (): void => {
      it('should return props with "props" key', (): void => {
        const props = (apiMapper1 as any).getProps(option1.map['post']);
        expect(props).toStrictEqual(option1.map['post']['props']);
      });
      it('should return props without "props" key', (): void => {
        const props = (apiMapper1 as any).getProps(option1.map['term']);
        expect(props).toStrictEqual(option1.map['term']);
      });
      it('should return props with "extends" key', (): void => {
        const postProps = (apiMapper1 as any).getProps(option1.map['page']);
        const pageProps = (apiMapper1 as any).getProps(option1.map['page']);
        expect(postProps).toStrictEqual(pageProps);
      });
      it('should return props without "reservedWords" key', (): void => {
        const props = (apiMapper1 as any).getProps(option1.map['image']);
        expect(props['one']).toBeUndefined();
        expect(props['extends']).toBeUndefined();
        expect(props['base']).toBeUndefined();
        expect(props['title']).toBe('title.rendered');
      });
    });

    describe('getDeepData()', (): void => {
      it('should return deepProps with "props" key', (): void => {
        const title = (apiMapper1 as any).getDeepData(
          postData[0],
          'title.rendered'
        );
        expect(title).toBe('title001');
      });
      it("should return Null if 2nd arg isn't string", (): void => {
        const title = (apiMapper1 as any).getDeepData(postData[0], null);
        expect(title).toBeNull();
      });
      it("should return Null if 2nd arg isn't string", (): void => {
        const title = (apiMapper1 as any).getDeepData(postData[0], null);
        expect(title).toBeNull();
      });
    });

    describe('hasNestedProps()', (): void => {
      it('should return true when it has "extends" key', (): void => {
        const pageMap = option1.map['page'];
        expect(pageMap.extends).toBeDefined();

        const hasNestedProps = (apiMapper1 as any).hasNestedProps(pageMap);
        expect(hasNestedProps).toBeTruthy();
      });

      // it('should return true when it has "props" key', (): void => {
      //   const postMap = option1.map['post'];
      //   expect(postMap.props).toBeDefined();

      //   const hasNestedProps = (apiMapper1 as any).hasNestedProps(postMap);
      //   expect(hasNestedProps).toBeTruthy();
      // });

      it("should return false when it doesn't have any nest key", (): void => {
        const imageMap = option1.map['image'];
        expect(imageMap.props).toBeUndefined();
        expect(imageMap.extends).toBeUndefined();

        const hasNestedProps = (apiMapper1 as any).hasNestedProps(imageMap);
        expect(hasNestedProps).toBeFalsy();
      });
    });
    describe('mergeProps()', (): void => {
      it('should return mappingData', (): void => {
        const imageConfigProps = (apiMapper1 as any).getProps(
          option1.map['image']
        );
        const mappingData = (apiMapper1 as any).mergeProps(
          postData[0]['_embedded']['wp:featuredmedia'][0],
          imageConfigProps
        );
        expect(mappingData.id).toBe(11);
        expect(mappingData.title).toBe('attachment-title11');
        expect(mappingData.type).toBeUndefined();
      });
    });

    describe('getMappingData()', (): void => {
      it('should return mappingData of object if 1st arg is object', (): void => {
        const termsConfigProps = (apiMapper1 as any).getMappingData(
          postData[0],
          option1.map['post']
        );
        const termsConfigProps1 = (apiMapper1 as any).getMappingData(
          postData[1],
          option1.map['post']
        );
        expect(termsConfigProps.id).toBe(1);
        expect(termsConfigProps.title).toBe('title001');
        expect(termsConfigProps.image.title).toBe('attachment-title11');
        expect(termsConfigProps1.image).toBe(null);
        // expect(termsConfigProps.terms[0]).toBe('カテゴリ-001');
        expect(termsConfigProps.terms[0].title).toBe('カテゴリ-001');
        expect(termsConfigProps.terms[1].title).toBe('カテゴリ-002');
        expect(termsConfigProps.type).toBeUndefined();
      });
    });

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
      const res = await apiMapper1.get(endpoint, params);
      expect(res['data'][0].id).toBe(1);
      expect(res['data'][1].id).toBe(2);
      expect(res['data'][0].title).toBe('title001');
      expect(res['data'][0].image.title).toBe('attachment-title11');
      expect(res['data'][0].image.sizes.medium.width).toBe(720);
      expect(res['data'][1].image).toBe(null);
      expect(res['data'][0].categories).toStrictEqual([1, 2]);
      expect(res['data'][1].categories).toStrictEqual([2, 3]);
      expect(res['data'][0].terms[0].title).toBe('カテゴリ-001');
      expect(res['data'][1].terms[1].title).toBe('カテゴリ-003');
      expect(res['data'][0].slug).toBeUndefined();
      expect(res['error']).toBeUndefined();
    });

    it('get() should return post json with error', async (): Promise<void> => {
      const [endpoint, params]: [string, object] = ['/error-posts-path', {}];
      const res = await apiMapper1.get(endpoint, params);
      expect(res['data']).toBeUndefined();
      expect(res['error']).toBe(
        `This method "get" or this endpoint "${endpoint}" does'nt be found`
      );
    });
  });
});
