import {ContainerConfiguration, Scope} from 'typescript-ioc';
import {CalculatorApi} from './calculator.api';
import {CalculatorService} from './calculator.service';
import {ConverterService} from './converter.service';
import {ConverterApi} from './converter.api';

const config: ContainerConfiguration[] = [
  {
    bind: CalculatorApi,
    to: CalculatorService,
    scope: Scope.Singleton
  },
  {
    bind: ConverterApi,
    to: ConverterService,
    scope: Scope.Singleton
  }
];

export default config;