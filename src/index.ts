import axios from 'axios';
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

  public async get({
    endpoint,
    params
  }: {
    endpoint: string;
    params: object;
  }): Promise<object> {
    const serviceEndpoint: ServiceEndpoint = this.getServiceEndpoint({
      method: 'get',
      endpoint
    });
    if (serviceEndpoint.error) {
      return { error: serviceEndpoint.error };
    }

    const res = await axios.get(this.baseURI + serviceEndpoint.path, {
      params
    });
    // res.data = this.mapProparty( res.data, serviceEndpoint.name )
    return res;
  }

  // async post({ endpoint, params }: { endpoint: string; params: object; }): Promise<object> {
  //   const serviceEndpoint: ServiceEndpoint = this.getServiceEndpoint({ method: 'post', endpoint })

  //   if(!serviceEndpoint) return null
  //   const res = await axios.post( this.baseURI + serviceEndpoint.path, params)
  //   res.data = this.mapProparty( res.data, serviceEndpoint.name )
  //   return res;
  // }

  // async put(endpoint: string, params: object){
  //   const serviceEndpoint: ServiceEndpoint = this.getServiceEndpoint({ method: 'put', endpoint })

  //   if(!serviceEndpoint) return null
  //   const res = await axios.put( this.baseURI + serviceEndpoint.path, params)
  //   res.data = this.mapProparty( res.data, serviceEndpoint.name )
  //   return res;
  // }

  // async delete(endpoint: string, params: object){
  //   const serviceEndpoint: ServiceEndpoint = this.getServiceEndpoint({ method: 'delete', endpoint })

  //   if(!name) return {
  //     error: `This method "${method}" or this endpoint "${endpoint}" does'nt be found`
  //   }
  //   const res = await axios.delete( this.baseURI + serviceEndpoint.path, params)
  //   res.data = this.mapProparty( res.data, serviceEndpoint.name )
  //   return res;
  // }

  // private getServiceEndpointError(method: string, endpoint: string): string {
  //   return `This method "${method}" or this endpoint "${endpoint}" does'nt be found`
  // }

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

  // mapProparty(originData, name){
  //   if(this.propMap && this.propMap[name]){
  //     const propValue = this.propMap[name] || {}
  //     const data = this.getMappingData(originData, propValue)
  //     return data;
  //   }else{
  //     return originData
  //   }
  // }

  // getMappingData(originData, propValue){
  //   const props = this.getProps( propValue )

  //   if (originData && propValue['base']) {
  //     originData = this.getDeepData(originData, propValue['base'])
  //   }

  //   if(originData && propValue['one']){
  //     const index = typeof propValue['one'] === 'number' ? propValue['one'] - 1 : 0
  //     originData = originData[index] || originData[0] || {}
  //   }

  //   if(originData && Array.isArray(originData)){
  //     const mappingData = []
  //     originData.forEach((data, i)=>{
  //       mappingData.push( this.getMappingData(data, propValue) )
  //     })
  //     return mappingData;
  //   }

  //   return this.mergeProps(originData, props);
  // }

  // getDeepData(data, basePropStr){
  //   if(!basePropStr || typeof basePropStr !== 'string') return data;

  //   const basePropKeys = basePropStr.split('.')
  //   data = basePropKeys.reduce((d, basePropKey)=>{
  //     return d && d[ basePropKey ] || null
  //   }, data)

  //   return data
  // }

  getProps(propValue) {
    let props = propValue['props'] || propValue || {};

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

  // hasNestedProps(propValue){
  //   return propValue['props'] || propValue['extends']
  // }

  // mergeProps(originData, props){
  //   const data = {};
  //   Object.keys(props).forEach((propKey)=>{
  //     const propValue = props[ propKey ]
  //     if( this.hasNestedProps( propValue ) ){
  //       data[ propKey ] = this.getMappingData(originData, propValue)
  //     }else if(typeof propValue === 'string'){
  //       data[ propKey ] = this.getDeepData(originData, propValue)
  //     }
  //   })
  //   return data
  // }
}

export default ApiMapper;
