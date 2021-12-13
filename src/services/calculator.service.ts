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

    if (operands.trim() === "") throw new BadRequestError("No input provided");

    // Check the length of the operands
    let Operands = operands.split(",");

    // If there is only one operand then return the operand as it is
    if (Operands.length === 1) return Operands[0].trim().toString();

    // Convert operands list from Roman to Numbers
    const numbers: number[] = await Promise.all(Operands.map(async operand => await this.converterApi.toNumber(operand.trim())));;

    // Pass the Numbers list to Add/Sub/Mult/Div function  
    let resultNumber: number = this.whichOperation(operation, numbers);

    // Convert result number to Roman
    return await this.converterApi.toRoman(resultNumber);
  }

  private whichOperation(operation: string, numbers: number[]): number {
    let resultNumber: number;
    switch (operation) {
      case "add":
        resultNumber = this.add(numbers);
        break;
      case "sub":
        resultNumber = this.sub(numbers);

      default:
        break;
    }
    return resultNumber;
  }
  private sub(numbers: number[]): number {
    numbers = numbers.sort((a, b) => b - a);
    let result: number = numbers[0];
    for (let i = 1; i < numbers.length; i++) result -= numbers[i];
    return result;
  }

  private add(operands: number[]): number {
    let result: number = 0;
    operands.forEach(operand => result += operand);
    return result;
  }
}
