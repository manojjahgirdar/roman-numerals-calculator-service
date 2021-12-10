import { ConverterApi } from './converter.api';
import { Inject } from 'typescript-ioc';
import { LoggerApi } from '../logger';
import axios from 'axios';
import { BadRequestError } from 'typescript-rest/dist/server/model/errors';

export class ConverterService implements ConverterApi {
    logger: LoggerApi;
    baseURL = "https://roman-numerals-converter-service-dev-manoj.eco-training-f2c6cdc6801be85fd188b09d006f13e3-0000.us-east.containers.appdomain.cloud";

    constructor(
        @Inject
        logger: LoggerApi,
    ) {
        this.logger = logger.child('ConverterService');
    }
    async toRoman(value: number): Promise<string> {
        return await axios.get(`${this.baseURL}/to-roman`, { params: { value: value } }).then(response => {
            return response.data;
        }).catch(error => {
            const err = {...error};
            if (err.statusCode === 400) throw new BadRequestError("Invalid number");
            throw new BadRequestError("Invalid number");
        });
    }
    async toNumber(value: string): Promise<number> {
        return await axios.get(`${this.baseURL}/to-number`, { params: { value: value } }).then(response => {
            return response.data;
        }).catch(error => {
            const err = {...error};
            if (err.statusCode === 400) throw new BadRequestError("Invalid Roman Numeral");
            throw new BadRequestError("Invalid Roman Numeral");
        });
    }
}
