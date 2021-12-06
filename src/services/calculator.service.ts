import {CalculatorApi} from './calculator.api';
import {Inject} from 'typescript-ioc';
import {LoggerApi} from '../logger';

export class CalculatorService implements CalculatorApi {
  logger: LoggerApi;

  constructor(
    @Inject
    logger: LoggerApi,
  ) {
    this.logger = logger.child('CalculatorServiceService');
  }

  async calculate(operation: string = "add", operands: string = "I,II"): Promise<string> {
    this.logger.info(`calculate function invoked with operation: ${operation} and operands: ${operands}`);
    return `III`;
  }
}
