import { Pipe, PipeTransform } from '@angular/core'
import { AnchorRegistry } from '../model';

@Pipe({
  name: 'values'
})
export class ValuesPipe implements PipeTransform {

  transform(obj: AnchorRegistry, args?: any): any {
    const values = []

    for (const value of Object.values(obj)) {
      if (!!value.parent) continue
      else values.push(value)
    }

    return values
  }
}
