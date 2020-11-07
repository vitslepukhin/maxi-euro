import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CurrencyModel } from 'src/app/models/currency.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeComponent implements OnInit, OnDestroy {
  ngUnsubscribe$ = new Subject<void>();
  newValue = false;
  @HostBinding('class.new-value') get getNewValue(): boolean {
    return this.newValue;
  }
  currency: CurrencyModel = {
    Value: '0.0000',
    CharCode: 'Curr',
  };

  constructor(
    private dataService: DataService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dataService
      .getRate()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((currency) => {
        this.currency = currency;
        this.toggleNewValue();
        this.cd.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  toggleNewValue(): void {
    this.newValue = true;
    setTimeout(() => {
      this.newValue = false;
    }, 500);
  }
}
