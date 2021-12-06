import {ContainerConfiguration, Scope} from 'typescript-ioc';
import {CalculatorApi} from './calculator.api';
import {CalculatorService} from './calculator.service';

const config: ContainerConfiguration[] = [
  {
    bind: CalculatorApi,
    to: CalculatorService,
    scope: Scope.Singleton
  }
];

export default config;