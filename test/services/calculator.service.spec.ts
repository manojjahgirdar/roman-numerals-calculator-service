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
    context('Operator "add"', () => {
      const operation = 'add';
      context('for no operands i.e ""', () => {
        const operands: string = '';
        test('it should throw Bad Request Error', async () => {
          await expect(service.calculate(operation, operands)).rejects.toThrow('No input provided');
        });
      });
      context('for one operand i.e "I"', () => {
        const operands: string = 'I';
        const result = '1';
        test('it should return "1"', async () => {
          expect(await service.calculate(operation, operands)).toBe(result);
        });
      });
      context('for two operands i.e "I, II"', () => {
        const operands: string = 'I, II';
        const result = '3';
        test('it should return "3"', async () => {
          expect(await service.calculate(operation, operands)).toEqual(result);
        });
      });
      context('for more than 2 operands i.e. "I, II, III"', () => {
        const operands: string = 'I, II, III';
        const result = '6';
        test('it should return "6"', async () => {
          expect(await service.calculate(operation, operands)).toEqual(result);
        });
      });
    });
  });
});
