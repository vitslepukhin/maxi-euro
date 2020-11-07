import { Observable } from 'rxjs';
import { CurrencyModel } from './currency.model';

export interface CurrencySource {
  getData(): Observable<CurrencyModel[]>;
}
