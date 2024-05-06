import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multiselectInterface',
  pure: true,
})
export class MultiselectInterfacePipe implements PipeTransform {

  transform(values: string[], data: {value:string, label:string}[]): {value:string, label:string}[] {
    if (values?.length && data?.length) {
      return data.filter(item => values.includes(item.value));
    } else {
      return [];
    }
  }
}
