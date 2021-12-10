export abstract class ConverterApi {
    abstract toRoman(value?: number): Promise<string>;
    abstract toNumber(value?: string): Promise<number>;
}
  