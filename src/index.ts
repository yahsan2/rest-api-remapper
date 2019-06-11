import axios from 'axios';
import qs from 'qs';

import { Options } from './Options';
import { ServiceEndpoint } from './ServiceEndpoint';

class ApiMapper {
  public baseURI: string;
  public api: any;
  public propMap: object;
  private reservedWords: string[];

  public constructor(options: Options) {
    this.baseURI = options.baseURI;
    this.api = options.api;
    this.propMap = options.map;
    this.reservedWords = ['one', 'base', 'extends', 'props'];
  }

  public async get(
    endpoint: string,
    params: object,
    isParamsSerializer?: Boolean
  ): Promise<object> {
    const serviceEndpoint: ServiceEndpoint = this.getServiceEndpoint({
      method: 'get',
      endpoint
    });
    if (serviceEndpoint.error) {
      return { error: serviceEndpoint.error };
    }
    const paramsSerializer = isParamsSerializer
      ? params => qs.stringify(params)
      : () => {};
    const res = await axios.get(this.baseURI + serviceEndpoint.path, {
      params,
      paramsSerializer
    });
    res.data = this.mapProparty(res.data, serviceEndpoint.name);
    return res;
  }

  async post(endpoint: string, params: object): Promise<object> {
    const serviceEndpoint: ServiceEndpoint = this.getServiceEndpoint({
      method: 'post',
      endpoint
    });
    if (serviceEndpoint.error) {
      return { error: serviceEndpoint.error };
    }
    const res = await axios.post(this.baseURI + serviceEndpoint.path, params);
    res.data = this.mapProparty(res.data, serviceEndpoint.name);
    return res;
  }

  async put(endpoint: string, params: object) {
    const serviceEndpoint: ServiceEndpoint = this.getServiceEndpoint({
      method: 'put',
      endpoint
    });
    if (serviceEndpoint.error) {
      return { error: serviceEndpoint.error };
    }
    const res = await axios.put(this.baseURI + serviceEndpoint.path, params);
    res.data = this.mapProparty(res.data, serviceEndpoint.name);
    return res;
  }

  async delete(endpoint: string, params: object) {
    const serviceEndpoint: ServiceEndpoint = this.getServiceEndpoint({
      method: 'delete',
      endpoint
    });
    if (serviceEndpoint.error) {
      return { error: serviceEndpoint.error };
    }
    const res = await axios.delete(this.baseURI + serviceEndpoint.path, params);
    res.data = this.mapProparty(res.data, serviceEndpoint.name);
    return res;
  }

  public getServiceEndpoint({
    method,
    endpoint
  }: {
    method: string;
    endpoint: string;
  }): ServiceEndpoint {
    const name =
      Object.keys(this.api).filter(n => {
        return this.api[n][method] && this.api[n][method][endpoint];
      })[0] || null;

    if (!name) {
      return {
        error: `This method "${method}" or this endpoint "${endpoint}" does'nt be found`
      };
    }

    return {
      name,
      path: this.api[name][method][endpoint]
    };
  }

  public mapProparty(originData: object, name: string): object {
    if (this.propMap && this.propMap[name]) {
      const propValue = this.propMap[name] || {};
      const data = this.getMappingData(originData, propValue);
      return data;
    } else {
      return originData;
    }
  }

  private getMappingData(originData: object, configPropValue: object): object {
    const configProps: object = this.getProps(configPropValue);

    if (originData && configPropValue['base']) {
      originData = this.getDeepData(originData, configPropValue['base']);
    }

    if (originData && configPropValue['one']) {
      const index =
        typeof configPropValue['one'] === 'number'
          ? configPropValue['one'] - 1
          : 0;
      originData = originData[index] || originData[0] || {};
    }

    if (originData && Array.isArray(originData)) {
      const mappingData = [];
      originData.forEach((data, i) => {
        mappingData.push(this.getMappingData(data, configProps));
      });
      return mappingData;
    }

    return this.mergeProps(originData, configProps);
  }

  private getDeepData(data: object, basePropStr: any): any {
    if (!basePropStr || typeof basePropStr !== 'string') return null;

    const basePropKeys = basePropStr.split('.');
    data = basePropKeys.reduce((d, basePropKey) => {
      return (d && d[basePropKey]) || null;
    }, data);

    return data;
  }

  private getProps(propValue: any): object {
    let props: object = propValue['props'] || propValue || {};

    if (propValue && propValue['extends']) {
      const extendPropValue = this.propMap[propValue['extends']] || null;
      if (extendPropValue) {
        props = Object.assign(
          {},
          props,
          extendPropValue['props'] || extendPropValue
        );
      } else {
        console.error("Extend Props doesn't exists");
      }
    }

    this.reservedWords.forEach(reservedWord => {
      delete props[reservedWord];
    });

    return props;
  }

  private hasNestedProps(propValue: object): boolean {
    return !!(propValue['base'] || propValue['props'] || propValue['extends']);
  }

  private mergeProps(originData: object, configProps: object): object {
    const data = {};
    Object.keys(configProps).forEach(configPropKey => {
      const propValue = configProps[configPropKey];
      if (this.hasNestedProps(propValue)) {
        data[configPropKey] = this.getMappingData(originData, propValue);
      } else if (typeof propValue === 'string') {
        data[configPropKey] = this.getDeepData(originData, propValue);
      }
    });
    return data;
  }
}

export default ApiMapper;
