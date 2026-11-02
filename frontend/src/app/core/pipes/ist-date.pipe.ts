import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'istDate',
  standalone: true
})
export class IstDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined, formatType: 'full' | 'short' | 'time' | 'dateOnly' = 'full'): string {
    if (!value) {
      return '—';
    }

    try {
      const date = typeof value === 'string' ? new Date(value) : value;
      if (isNaN(date.getTime())) return '—';

      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata'
      };

      if (formatType === 'full') {
        options.day = '2-digit';
        options.month = 'short';
        options.year = 'numeric';
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.hour12 = true;
      } else if (formatType === 'short') {
        options.day = '2-digit';
        options.month = 'short';
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.hour12 = true;
      } else if (formatType === 'dateOnly') {
        options.day = '2-digit';
        options.month = 'short';
        options.year = 'numeric';
      } else if (formatType === 'time') {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.hour12 = true;
      }

      const formatted = new Intl.DateTimeFormat('en-IN', options).format(date);
      return `${formatted} IST`;
    } catch {
      return '—';
    }
  }
}
