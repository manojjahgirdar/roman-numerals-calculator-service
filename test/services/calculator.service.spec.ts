import {Container} from 'typescript-ioc';

import {CalculatorService} from '../../src/services';
import {ApiServer} from '../../src/server';
import {buildApiServer} from '../helper';

describe('Hello World service', () =>{

  let app: ApiServer;
  let service: CalculatorService;
  beforeAll(() => {
    app = buildApiServer();

    service = Container.get(CalculatorService);
  });

  test('canary test verifies test infrastructure', () => {
    expect(service).not.toBeUndefined();
  });

  describe('Given calculate()', () => {
    context('when operator "add" and operands "I, II" is provided', () => {
      const operation = 'add';
      const operands = 'I, II';
      test('then return "III"', async () => {
        expect(await service.calculate(operation, operands)).toEqual(`III`);
      });
    });
  });
});
