import { Container } from 'typescript-ioc';
import { ConverterService } from '../../src/services';
import axios from 'axios';
import { BadRequestError } from 'typescript-rest/dist/server/model/errors';

const baseURL: string = "https://roman-numerals-converter-service-dev-manoj.eco-training-f2c6cdc6801be85fd188b09d006f13e3-0000.us-east.containers.appdomain.cloud";

jest.mock('axios');
let mockAxios = axios as jest.Mocked<typeof axios>;

describe('Converter API Mock Testing', () => {
  let service: ConverterService;

  beforeAll(() => {
    service = Container.get(ConverterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('canary validates test infrastructure', () => {
    expect(service).not.toBeUndefined();
  });

  describe('Test toRoman', () => {
    context('toRoman() should make only 1 API call and return valid response', () => {
      let input: number = 14;
      let output: string = "XIV";

      test(`for ${input} it should return ${output}`, async () => {
        // Setup
        mockAxios.get.mockImplementationOnce(() => {
          return Promise.resolve({ data: output });
        });

        // Work
        let result = await service.toRoman(input);

        // Assertions / Expectations
        expect(result).toEqual(output);
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith(`${baseURL}/to-roman`, { params: { value: input } });
      });
    });
    context('toRoman() should make only 1 API call and thow Bad Request Error when called with invalid input', () => {
      let input: number = -1;

      test(`for ${input} it should throw Bad Request Error`, async () => {
        // Setup
        mockAxios.get.mockImplementationOnce(() => {
          return Promise.reject(new BadRequestError("Invalid number"));
        });

        // Work
        await expect(service.toRoman(input)).rejects.toThrow(BadRequestError);

        // Assertions / Expectations
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith(`${baseURL}/to-roman`, { params: { value: input } });
      });
    });
  });
  describe('Test toNumber', () => {
    context('toNumber() should make only 1 API call and return valid response', () => {
      const input: string = "XXVI";
      const output: number = 26;

      test(`for ${input} it should return ${input}`, async () => {
        // Setup
        mockAxios.get.mockImplementationOnce(() => {
          return Promise.resolve({ data: output });
        });

        // Work
        let result = await service.toNumber(input);

        // Assertions / Expectations
        expect(result).toEqual(output);
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith(`${baseURL}/to-number`, { params: { value: input } });
      });
    });
    context('toNumber() should make only 1 API call and thow Bad Request Error when called with invalid input', () => {
      const input: string = "XXXXVI";

      test(`for ${input} it should throw Bad Request Error`, async () => {
        // Setup
        mockAxios.get.mockImplementationOnce(() => {
          return Promise.reject(new BadRequestError("Invalid number"));
        });

        // Work
        await expect(service.toNumber(input)).rejects.toThrow(BadRequestError);

        // Assertions / Expectations
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith(`${baseURL}/to-number`, { params: { value: input } });
      });
    });
  });
});