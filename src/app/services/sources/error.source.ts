import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { CurrencySource } from 'src/app/models/currency-source.model';
import { CurrencyModel } from 'src/app/models/currency.model';

export class ErrorSource implements CurrencySource {
  readonly url = 'Not exising URL';
  constructor(private http: HttpClient) {}
  getData(): Observable<CurrencyModel[]> {
    return this.http.get<never>(this.url).pipe(mapTo([]));
  }
}
