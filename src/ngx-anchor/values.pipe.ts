import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'values'
})
export class ValuesPipe implements PipeTransform {

  transform(obj: Object, args?: any): any {
    const values = []

    for (const value of Object.values(obj)) {
      values.push(value)
    }

    return values
  }
}
