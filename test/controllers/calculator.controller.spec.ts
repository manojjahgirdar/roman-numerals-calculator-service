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
  let mockGreeting: jest.Mock;

  beforeEach(() => {
    const apiServer = buildApiServer();

    app = apiServer.getApp();

    Container.bind(CalculatorApi).scope(Scope.Singleton).to(MockCalculatorService);

    const mockService: CalculatorApi = Container.get(CalculatorApi);
    mockGreeting = mockService.calculate as jest.Mock;
  });

  test('canary validates test infrastructure', () => {
    expect(true).toBe(true);
  });

  describe('Given /add?operands=I,II', () => {
    const expectedResponse = 'III';

    beforeEach(() => {
      mockGreeting.mockReturnValueOnce(Promise.resolve(expectedResponse));
    });

    test('should return "Hello, World!"', done => {
      request(app).get('/add?operands=I,II').expect(200).expect(expectedResponse, done);
    });
  });
});
