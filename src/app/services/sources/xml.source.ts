import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrencySource } from 'src/app/models/currency-source.model';
import { CurrencyModel } from 'src/app/models/currency.model';

export class XmlSource implements CurrencySource {
  readonly url = 'https://www.cbr-xml-daily.ru/daily_utf8.xml';
  constructor(private http: HttpClient) {}
  getData(): Observable<CurrencyModel[]> {
    return this.http
      .get<any>(this.url, { responseType: 'text' as 'json' })
      .pipe(
        map((data) => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(data, 'application/xml');
          const valuteElements = dom.querySelectorAll('Valute');
          const result = [];
          valuteElements.forEach((node) => {
            const CharCode = node.querySelector('CharCode').textContent;
            const Value = node
              .querySelector('Value')
              .textContent.replace(',', '.');
            node = null;
            const valute = {
              CharCode,
              Value,
            };
            result.push(valute);
          });
          return result;
        })
      );
  }
}
