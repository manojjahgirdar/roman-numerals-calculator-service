import { Container, Scope } from 'typescript-ioc';
import { CalculatorService, ConverterApi } from '../../src/services';
import { ApiServer } from '../../src/server';
import { BadRequestError, NotImplementedError } from 'typescript-rest/dist/server/model/errors';

class MockConverterService implements ConverterApi {
  toNumber = jest.fn().mockName('toNumber');
  toRoman = jest.fn().mockName('toRoman');
}

describe('Calculator service', () => {
  let service: CalculatorService;
  let mockToRoman: jest.Mock;
  let mockToNumber: jest.Mock;

  beforeAll(() => {
    service = Container.get(CalculatorService);
    Container.bind(ConverterApi).scope(Scope.Singleton).to(MockConverterService);
    service.converterApi = Container.get(ConverterApi);
    mockToRoman = service.converterApi.toRoman as jest.Mock;
    mockToNumber = service.converterApi.toNumber as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('canary test verifies test infrastructure', () => {
    expect(service).not.toBeUndefined();
  });

  describe('Given calculate(operation, operands)', () => {
    context('Any operation', () => {
      const operation = ['add', 'subtract', 'multiply', 'divide'][Math.floor(Math.random() * 4)];
      context('for no operands i.e ""', () => {
        const operands: string = '';
        test('it should throw Bad Request Error', async () => {
          await expect(service.calculate(operation, operands)).rejects.toThrow('No input provided');
        });
      });
      context('for invalid roman numeral input like "II, XIIII", "III"', () => {
        
        test('it should throw Bad Request Error', async () => {
          const operands = 'II, XIIII, III';
          mockToNumber.mockImplementationOnce(() => {
            throw new BadRequestError("Invalid input");
          });
          await expect(service.calculate(operation, operands)).rejects.toThrow('Invalid input');
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

        test('it should return "III"', async () => {

          // Calculator microservice calculate() input and expected output
          const operands: string = 'I, II';
          const expectedOutput = 'III';

          // Converter mock microservice toNumber() input and expected output
          const romanNumeral: string[] = operands.split(',');
          const numberOutput: number[] = [1, 2];

          //Setup
          romanNumeral.forEach(roman => mockToNumber.mockResolvedValue(numberOutput));
          mockToRoman.mockResolvedValue(expectedOutput);

          //Work
          const result = await service.calculate(operation, operands);

          //Assertions / Expectations
          expect(result).toBe(expectedOutput);
          expect(mockToNumber).toHaveBeenCalledTimes(romanNumeral.length);
          expect(mockToRoman).toHaveBeenCalledTimes(1);
        });
      });
      context('for more than 2 operands i.e. "I, II, III"', () => {

        test('it should return "VI"', async () => {
          // Calculator microservice calculate() input and expected output
          const operands: string = 'I, II, III';
          const expectedOutput = 'VI';

          // Converter mock microservice toNumber() input and expected output
          const romanNumeral: string[] = operands.split(',');
          const numberOutput: number[] = [1, 2, 3];

          //Setup
          romanNumeral.forEach(roman => mockToNumber.mockResolvedValue(numberOutput));
          mockToRoman.mockResolvedValue(expectedOutput);

          //Work
          const result = await service.calculate(operation, operands);

          //Assertions / Expectations
          expect(result).toBe(expectedOutput);
          expect(mockToNumber).toHaveBeenCalledTimes(romanNumeral.length);
          expect(mockToRoman).toHaveBeenCalledTimes(1);
        });
      });
    });

    context('"sub" Operation', () => {
      const operation = 'sub';
      
      context('for two operands i.e "VI, II"', () => {

        test('it should return "IV"', async () => {
          // Calculator microservice calculate() input and expected output
          const operands: string = 'VI, II';
          const expectedOutput = 'IV';

          // Converter mock microservice toNumber() input and expected output
          const romanNumeral: string[] = operands.split(',');
          const numberOutput: number[] = [6, 2];

          //Setup
          romanNumeral.forEach(roman => mockToNumber.mockResolvedValue(numberOutput));
          mockToRoman.mockResolvedValue(expectedOutput);

          //Work
          const result = await service.calculate(operation, operands);

          //Assertions / Expectations
          expect(result).toBe(expectedOutput);
          expect(mockToNumber).toHaveBeenCalledTimes(romanNumeral.length);
          expect(mockToRoman).toHaveBeenCalledTimes(1);
        });
      });

      context('for two operands difference in negative i.e. "X, XI"', () => {

        test('it should throw Not Implemented Error', async () => {
          const operands = 'X, XI';
          mockToNumber.mockImplementationOnce(() => {
            throw new NotImplementedError("Result number out of range");
          });
          await expect(service.calculate(operation, operands)).rejects.toThrow('Result number out of range');
        });
      });

      context('for more than 2 operands i.e. "X, II, L"', () => {

        test('it should return "XXXVIII"', async () => {
          // Calculator microservice calculate() input and expected output
          const operands: string = 'X, II, L';
          const expectedOutput = 'XXXVIII';

          // Converter mock microservice toNumber() input and expected output
          const romanNumeral: string[] = operands.split(',');
          const numberOutput: number[] = [10, 2, 50];

          //Setup
          romanNumeral.forEach(roman => mockToNumber.mockResolvedValue(numberOutput));
          mockToRoman.mockResolvedValue(expectedOutput);

          //Work
          const result = await service.calculate(operation, operands);

          //Assertions / Expectations
          expect(result).toBe(expectedOutput);
          expect(mockToNumber).toHaveBeenCalledTimes(romanNumeral.length);
          expect(mockToRoman).toHaveBeenCalledTimes(1);
        });
      });
      context('for operands resulting in zero i.e. "X, X"', () => {

        test('it should return "nulla"', async () => {
          // Calculator microservice calculate() input and expected output
          const operands: string = 'X, X';
          const expectedOutput = 'nulla';

          // Converter mock microservice toNumber() input and expected output
          const romanNumeral: string[] = operands.split(',');
          const numberOutput: number[] = [10, 10];

          //Setup
          romanNumeral.forEach(roman => mockToNumber.mockResolvedValue(numberOutput));
          mockToRoman.mockResolvedValue(expectedOutput);

          //Work
          const result = await service.calculate(operation, operands);

          //Assertions / Expectations
          expect(result).toBe(expectedOutput);
          expect(mockToNumber).toHaveBeenCalledTimes(romanNumeral.length);
          expect(mockToRoman).toHaveBeenCalledTimes(1);
        });
      });
    });

    context('"mult" Operation', () => {
      const operation = 'mult';

      context('for two operands i.e "IV, VI"', () => {

        test('it should return "XXIV"', async () => {
          // Calculator microservice calculate() input and expected output
          const operands: string = 'IV, VI';
          const expectedOutput = 'XXIV';

          // Converter mock microservice toNumber() input and expected output
          const romanNumeral: string[] = operands.split(',');
          const numberOutput: number[] = [4, 6];

          //Setup
          romanNumeral.forEach(roman => mockToNumber.mockResolvedValue(numberOutput));
          mockToRoman.mockResolvedValue(expectedOutput);

          //Work
          const result = await service.calculate(operation, operands);

          //Assertions / Expectations
          expect(result).toBe(expectedOutput);
          expect(mockToNumber).toHaveBeenCalledTimes(romanNumeral.length);
          expect(mockToRoman).toHaveBeenCalledTimes(1);
        });
      });
      context('for more than 2 operands i.e. "VII, III, V"', () => {

        test('it should return "CV"', async () => {
          // Calculator microservice calculate() input and expected output
          const operands: string = 'VII, III, V';
          const expectedOutput = 'CV';

          // Converter mock microservice toNumber() input and expected output
          const romanNumeral: string[] = operands.split(',');
          const numberOutput: number[] = [7, 3, 5];

          //Setup
          romanNumeral.forEach(roman => mockToNumber.mockResolvedValue(numberOutput));
          mockToRoman.mockResolvedValue(expectedOutput);

          //Work
          const result = await service.calculate(operation, operands);

          //Assertions / Expectations
          expect(result).toBe(expectedOutput);
          expect(mockToNumber).toHaveBeenCalledTimes(romanNumeral.length);
          expect(mockToRoman).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
