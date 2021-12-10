import {Application} from 'express';
import {default as request} from 'supertest';
import {Container, Scope} from 'typescript-ioc';

import {CalculatorApi} from '../../src/services';
import {buildApiServer} from '../helper';

class MockCalculatorService implements CalculatorApi {
  calculate = jest.fn().mockName('calculate');
}

describe('calculator.controller', () => {

  let app: Application;
  let mockCalculator: jest.Mock;

  beforeEach(() => {
    const apiServer = buildApiServer();

    app = apiServer.getApp();

    Container.bind(CalculatorApi).scope(Scope.Singleton).to(MockCalculatorService);

    const mockService: CalculatorApi = Container.get(CalculatorApi);
    mockCalculator = mockService.calculate as jest.Mock;
  });

  test('canary validates test infrastructure', () => {
    expect(true).toBe(true);
  });

  describe('Given /add', () => {
    describe('When checking for valid input', () => {
      const input:string = 'I, IV, X';
      const output:string = '15';

      beforeEach(() => {
        mockCalculator.mockImplementationOnce(() => Promise.resolve(
          {
            data: output,
            status: 200
          }
          ));
      });
  
      afterEach(() => {
        jest.clearAllMocks();
      })

      context(`add("${input}") should make a mock API call to calculate() with operator "add" and operands "${input}""`, () => {
        test(`it should return ${output}`, () => {
          request(app)
          .get('/add')
          .query({operands: input})
          .expect(200)
          .expect(output);
        });
      });
    });
    
  });
});
