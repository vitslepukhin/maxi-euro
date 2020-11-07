import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { CurrencyModel } from '../models/currency.model';
import { SourceModel, sourceIterator } from './sources';
import { CurrencySource } from '../models/currency-source.model';

const errorCurrency: CurrencyModel = {
  Value: '0.0',
  CharCode: 'Err',
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private sourceIterator: Generator<SourceModel, void, unknown>;
  private currencySource: CurrencySource;

  constructor(private http: HttpClient) {
    this.sourceIterator = sourceIterator();
    const initSource = this.sourceIterator.next().value as SourceModel;
    this.setCurrencySource(initSource);
  }

  setCurrencySource(currencySource: SourceModel): void {
    this.currencySource = new currencySource(this.http);
  }

  getAll(): Observable<CurrencyModel[]> {
    return this.currencySource.getData().pipe(
      catchError(() => {
        this.switchToAnotherSource();
        return this.getAll();
      })
    );
  }

  getRate(currencyCharCode: string = 'EUR'): Observable<CurrencyModel> {
    return timer(0, 10000).pipe(
      exhaustMap(() =>
        this.getAll().pipe(
          map(
            (currencies: CurrencyModel[]): CurrencyModel => {
              const currency = currencies.find(({ CharCode }) => CharCode === currencyCharCode);
              return currency ?? errorCurrency;
            }
          )
        )
      )
    );
  }

  private switchToAnotherSource(): void {
    const nextSource = this.sourceIterator.next().value as SourceModel;
    this.setCurrencySource(nextSource);
  }
}
