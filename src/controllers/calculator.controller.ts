import {GET, Path, PathParam, QueryParam} from 'typescript-rest';
import {Inject} from 'typescript-ioc';
import {CalculatorApi} from '../services';
import {LoggerApi} from '../logger';

@Path('/add')
export class CalculatorController {

  @Inject
  service: CalculatorApi;
  @Inject
  _baseLogger: LoggerApi;

  get logger() {
    return this._baseLogger.child('CalculatorController');
  }

  @GET
  async AddFunc(@QueryParam('operands') operands: string): Promise<string> {
    this.logger.info(`AddFunc called with operands: ${operands}`);
    return this.service.calculate('add', operands);
  }
}
