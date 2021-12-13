import { CalculatorApi } from './calculator.api';
import { ConverterApi } from './converter.api';
import { Inject } from 'typescript-ioc';
import { LoggerApi } from '../logger';
import { BadRequestError } from 'typescript-rest/dist/server/model/errors';

export class CalculatorService implements CalculatorApi {
  logger: LoggerApi;
  converterApi: ConverterApi;

  constructor(
    @Inject
    logger: LoggerApi,
    @Inject
    converterApi: ConverterApi,
  ) {
    this.logger = logger.child('CalculatorService');
    this.converterApi = converterApi;
  }

  async calculate(operation: string = "add", operands: string = "I,II"): Promise<string> {
    this.logger.info(`calculate function invoked with operation: ${operation} and operands: ${operands}`);

    const { Operands, _length } = this.validate(operands);

    if (_length === 1) return Operands[0].trim().toString();

    const numbers: number[] = await Promise.all( // [1, 2]
      Operands.map(
        async operand => await this.converterApi.toNumber(operand.trim())
      )
    );

    const resultNumber: number = this.whichOperation(operation, numbers); // (add, [1, 2])

    return await this.converterApi.toRoman(resultNumber);
  }

  private validate(operands: string): { Operands: string[], _length: number } {
    if (!operands && operands.trim() === "") throw new BadRequestError("No input provided");
    const Operands = operands.split(",");
    return { Operands, _length: Operands.length };
  }

  private whichOperation(operation: string, numbers: number[]): number {
    let resultNumber: number;
    switch (operation) {
      case "add":
        resultNumber = this.add(numbers);
        break;
      case "sub":
        resultNumber = this.sub(numbers);
        break;
      case "mult":
        resultNumber = this.mult(numbers);
        break;
      default:
        throw new BadRequestError("Method not implemented");
    }
    return resultNumber;
  }
  private mult(operands: number[]): number {
    let result: number = 1;
    operands.forEach(operand => result *= operand);
    return result;
  }

  private add(operands: number[]): number { // [1, 2] => 0 + 1 = 1  1 + 2 = retuern 3
    let result: number = 0;
    operands.forEach(operand => result += operand);
    return result;
  }

  private sub(numbers: number[]): number {
    numbers = numbers.sort((a, b) => b - a);
    let result: number = numbers[0];
    for (let i = 1; i < numbers.length; i++) result -= numbers[i];
    return result;
  }
}
