export abstract class CalculatorApi {
  abstract calculate(operation?: string, operands?: string): Promise<string>;
}
