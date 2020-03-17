import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unitSearch'
})
export class UnitSearchPipe implements PipeTransform {

  transform(unites: any, text:string): any {
    if (text == undefined) {
      return unites
    }
    return unites.filter(function (unit) {
      return unit.unitNum.includes(text)
    });
  }

}
