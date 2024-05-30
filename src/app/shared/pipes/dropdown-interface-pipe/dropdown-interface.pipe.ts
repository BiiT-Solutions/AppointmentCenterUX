import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dropdownInterface',
  pure: false,
})
export class DropdownInterfacePipe implements PipeTransform {

  transform(value: string, data: {value:string, label:string}[]): {value:string, label:string} {
    return data.find(item => item.value == value);
  }
}
