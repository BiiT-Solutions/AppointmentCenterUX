import { Pipe, PipeTransform } from '@angular/core';
import {EventColor} from "biit-ui/calendar";

@Pipe({
  name: 'colorTheme',
  pure: false,
})
export class ColorThemePipe implements PipeTransform {

  transform(value: string): EventColor {
    // @ts-ignore
    return EventColor[value];
  }
}
