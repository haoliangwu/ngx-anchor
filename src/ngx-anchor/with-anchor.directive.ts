import { Directive, Input } from '@angular/core'

@Directive({
  selector: '[ngxWithAnchor]'
})
export class WithAnchorDirective {

  @Input('ngxWithAnchor')
  public id: string

  constructor() { }

}
