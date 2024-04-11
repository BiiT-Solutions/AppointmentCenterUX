import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dropdownTranslator',
  pure: false,
})
export class DropdownTranslatorPipe implements PipeTransform {

  transform(value: string, data: {value:string, label:string}[]): {value:string, label:string} {
    return data.find(item => item.value == value);
  }
}
