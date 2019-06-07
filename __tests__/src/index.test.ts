import { options } from "~/options";

import ApiMapper from "~/index"
import apiConfig = require("../fixture/api.config.test");

let apiMapper1: object;
let option1: options = apiConfig

describe('greet', (): void => {
  beforeAll((): void => {
    apiMapper1 = new ApiMapper(option1)
  });

  it('should have apiConfig.baseURI', (): void => {
    expect(option1.baseURI).toBe('../');
  });
})
