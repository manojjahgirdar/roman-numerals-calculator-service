import { Application } from 'express';
import { default as request } from 'supertest';
import { Container, Scope } from 'typescript-ioc';
import { BadRequestError } from 'typescript-rest/dist/server/model/errors';

import { CalculatorApi } from '../../src/services';
import { buildApiServer } from '../helper';

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
      const input: string = 'I, IV, X';
      const output: string = 'XV';

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

      context(`add("${input}") should make a mock API call to calculate() with operation "add" and operands "${input}""`, () => {
        test(`it should return ${output}`, () => {
          request(app)
            .get('/add')
            .query({ operands: input })
            .expect(200)
            .expect(output);
        });
      });
    });
    describe('When checking for invalid input', () => {
      const input: string = 'LXIM, IV, X';

      beforeEach(() => {
        mockCalculator.mockImplementationOnce(() => {
          throw new BadRequestError("Invalid input provided");
        });
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      context(`add("${input}") should make a mock API call to calculate() with operation "add" and operands "${input}""`, () => {
        test(`it should return BadRequestError`, () => {
          request(app)
            .get('/add')
            .query({ operands: input })
            .expect(400);
        });
      });


    });
  });

  describe('Given /sub', () => {
    describe('When checking for valid input', () => {
      const input: string = 'I, IV, X';
      const output: string = 'V';

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

      context(`sub("${input}") should make a mock API call to calculate() with operation "sub" and operands "${input}""`, () => {
        test(`it should return ${output}`, () => {
          request(app)
            .get('/sub')
            .query({ operands: input })
            .expect(200)
            .expect(output);
        });
      });
    });

    describe('When checking for invalid input', () => {
      const input: string = 'LXIM, IV, X';

      beforeEach(() => {
        mockCalculator.mockImplementationOnce(() => {
          throw new BadRequestError("Invalid input provided");
        });
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      context(`sub("${input}") should make a mock API call to calculate() with operation "sub" and operands "${input}""`, () => {
        test(`it should return BadRequestError`, () => {
          request(app)
            .get('/sub')
            .query({ operands: input })
            .expect(400);
        });
      });
    });
  });

  describe('Given /mult', () => {
    describe('When checking for valid input', () => {
      const input: string = 'II, IV, X';
      const output: string = 'LXX';

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

      context(`mult("${input}") should make a mock API call to calculate() with operation "mult" and operands "${input}""`, () => {
        test(`it should return ${output}`, () => {
          request(app)
            .get('/sub')
            .query({ operands: input })
            .expect(200)
            .expect(output);
        });
      });
    });

    describe('When checking for invalid input', () => {
      const input: string = 'LXIM, IV, X';

      beforeEach(() => {
        mockCalculator.mockImplementationOnce(() => {
          throw new BadRequestError("Invalid input provided");
        });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    context(`mult("${input}") should make a mock API call to calculate() with operation "mult" and operands "${input}""`, () => {
      test(`it should return BadRequestError`, () => {
        request(app)
          .get('/sub')
          .query({ operands: input })
          .expect(400);
      });
    });
    });
  });
});
