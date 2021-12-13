import {GET, Path, QueryParam} from 'typescript-rest';
import {Inject} from 'typescript-ioc';
import {CalculatorApi} from '../services';
import {LoggerApi} from '../logger';

@Path('/')
export class CalculatorController {

  @Inject
  service: CalculatorApi;
  @Inject
  _baseLogger: LoggerApi;

  get logger() {
    return this._baseLogger.child('CalculatorController');
  }

  @Path('/add')
  @GET
  async AddFunc(@QueryParam('operands') operands: string): Promise<string> {
    this.logger.info(`AddFunc called with operands: ${operands}`);
    return this.service.calculate('add', operands);
  }

  @Path('/sub')
  @GET
  async SubFunc(@QueryParam('operands') operands: string): Promise<string> {
    this.logger.info(`SubFunc called with operands: ${operands}`);
    return this.service.calculate('sub', operands);
  }

  @Path('/mult')
  @GET
  async MultFunc(@QueryParam('operands') operands: string): Promise<string> {
    this.logger.info(`MultFunc called with operands: ${operands}`);
    return this.service.calculate('mult', operands);
  }
}
