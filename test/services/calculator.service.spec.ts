import {Container} from 'typescript-ioc';
import {CalculatorService} from '../../src/services';
import {ApiServer} from '../../src/server';
import {buildApiServer} from '../helper';

describe('Calculator service', () =>{

  let app: ApiServer;
  let service: CalculatorService;
  beforeAll(() => {
    app = buildApiServer();

    service = Container.get(CalculatorService);
  });

  test('canary test verifies test infrastructure', () => {
    expect(service).not.toBeUndefined();
  });

  describe('Given calculate(operation, operands)', () => {
    context('Any operation', () => {
      // const operator = ['add', 'subtract', 'multiply', 'divide'][Math.floor(Math.random() * 4)];
      const operation = Math.random() > 0.5 ? 'add' : 'sub';
      context('for no operands i.e ""', () => {
        const operands: string = '';
        test('it should throw Bad Request Error', async () => {
          await expect(service.calculate(operation, operands)).rejects.toThrow('No input provided');
        });
      });
      context('for invalid roman numeral input like "II, XIIII", "III"', () => {
        const operands: string = 'II, XIIII, III';
        test('it should throw Bad Request Error', async () => {
          await expect(service.calculate(operation, operands)).rejects.toThrow('Invalid Roman Numeral');
        });
      });
    });
    context('"add" Operation', () => {
      const operation = 'add';

      context('for one operand i.e "I"', () => {
        const operands: string = 'I';
        const result = 'I';
        test('it should return "I"', async () => {
          expect(await service.calculate(operation, operands)).toBe(result);
        });
      });
      context('for two operands i.e "I, II"', () => {
        const operands: string = 'I, II';
        const result = 'III';
        test('it should return "III"', async () => {
          expect(await service.calculate(operation, operands)).toEqual(result);
        });
      });
      context('for more than 2 operands i.e. "I, II, III"', () => {
        const operands: string = 'I, II, III';
        const result = 'VI';
        test('it should return "VI"', async () => {
          expect(await service.calculate(operation, operands)).toEqual(result);
        });
      });
    });

    context('"sub" Operation', () => {
      const operation = 'sub';
      context('for one operand i.e "I"', () => {
        const operands: string = 'I';
        const result = 'I';
        test('it should return "I"', async () => {
          expect(await service.calculate(operation, operands)).toBe(result);
        });
      });
      context('for two operands i.e "I, VI"', () => {
        const operands: string = 'I, VI';
        const result = 'V';
        test('it should return "V"', async () => {
          expect(await service.calculate(operation, operands)).toBe(result);
        });
      });
      context('for more than 2 operands i.e. "X, II, L"', () => {
        const operands: string = 'X, II, L';
        const result = 'XXXVIII';
        test('it should return "XXXVIII"', async () => {
          expect(await service.calculate(operation, operands)).toBe(result);
        });
      });
      context('for operands resulting in zero i.e. "X, X"', () => {
        const operands: string = 'X, X';
        const result = 'nulla';
        test('it should return "nulla"', async () => {
          expect(await service.calculate(operation, operands)).toBe(result);
        });
      });
    });
  });
});
