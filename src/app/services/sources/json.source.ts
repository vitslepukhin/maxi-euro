import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrencySource } from 'src/app/models/currency-source.model';
import { CurrencyModel } from 'src/app/models/currency.model';

export class JsonSource implements CurrencySource {
  readonly url = 'https://www.cbr-xml-daily.ru/daily_json.js';
  constructor(private http: HttpClient) {}
  getData(): Observable<CurrencyModel[]> {
    return this.http.get<unknown>(this.url).pipe(
      map(({ Valute }) => {
        return Object.values(Valute).map(({ CharCode, Value }) => ({
          CharCode,
          Value,
        }));
      })
    );
  }
}
