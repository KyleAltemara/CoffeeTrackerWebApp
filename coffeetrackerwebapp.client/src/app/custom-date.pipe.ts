import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = date.toLocaleDateString(undefined, options);

    if (date.getHours() !== 0 || date.getMinutes() !== 0) {
      formattedDate += ` ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    }

    return formattedDate;
  }
}
