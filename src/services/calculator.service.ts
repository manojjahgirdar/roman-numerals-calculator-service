import { CalculatorApi } from './calculator.api';
import { ConverterApi } from './converter.api';
import { Inject } from 'typescript-ioc';
import { LoggerApi } from '../logger';
import { BadRequestError, NotImplementedError } from 'typescript-rest/dist/server/model/errors';

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

  private MathOperations = {
    add: (a:number, b:number) => a + b,
    sub: (a:number, b:number) => a - b,
    mult: (a:number, b:number) => a * b
  }

  private validate(operands: string): { Operands: string[], _length: number } {
    if (!operands && operands.trim() === "") throw new BadRequestError("No input provided");
    const Operands = operands.split(",");
    return { Operands, _length: Operands.length };
  }

  async calculate(operation: string = "add", operands: string = "I,II"): Promise<string> {
    this.logger.info(`calculate function invoked with operation: ${operation} and operands: ${operands}`);

    const { Operands, _length } = this.validate(operands);

    if (_length === 1) return Operands[0].trim();

    const numbers: number[] = await Promise.all(Operands.map(async operand => await this.converterApi.toNumber(operand.trim())));

    const resultNumber: number = numbers.reduce(this.MathOperations[operation]);

    if (resultNumber < 0 || resultNumber > 3999) throw new NotImplementedError("Result number out of range");

    return await this.converterApi.toRoman(resultNumber);
  }
}
