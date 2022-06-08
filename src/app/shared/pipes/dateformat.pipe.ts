import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateformat',
})
export class DateformatPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    const formatTime = value.slice(0, -3);
    const formatText = 'Publicada ' + formatTime.replace('T', ' a las ');
    return formatText;
  }
}
