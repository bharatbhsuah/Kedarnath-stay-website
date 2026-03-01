import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyInr'
})
export class CurrencyInrPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }
}

