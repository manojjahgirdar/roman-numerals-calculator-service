import {CalculatorApi} from './calculator.api';
import { ConverterApi } from './converter.api';
import {Inject} from 'typescript-ioc';
import {LoggerApi} from '../logger';
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
    
    // Convert operands list from Roman to Numbers
    const numbers: number[] = await Promise.all(operands.split(",").map(async operand => await this.converterApi.toNumber(operand.trim())));;
    
    // Pass the Numbers list to Add/Sub/Mult/Div function  
    let resultNumber: number = this.whichOperation(operation, numbers);
    
    // Convert result number to Roman
    return resultNumber.toString();
  }

  private whichOperation(operation: string, numbers: number[]): number {
    let resultNumber: number;
    switch (operation) {
      case "add":
        resultNumber = this.add(numbers);
        break;

      default:
        break;
    }
    return resultNumber;
  }

  private add(operands: number[]): number {
    let result: number = 0;
    operands.forEach(operand => result += operand);
    return result;
  }
}
