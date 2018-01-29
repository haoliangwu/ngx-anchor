import { Directive, ElementRef, Input, Optional } from '@angular/core'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks'
import { getElementTop, getElementViewTop } from './utils/dom'
import { AnchorService } from './anchor.service'
import { WithAnchorDirective } from './with-anchor.directive'

@Directive({
  selector: '[ngxAnchor]'
})
export class AnchorDirective implements OnInit {
  @Input('ngxAnchor') id: string
  @Input('header') isHeader: boolean

  constructor(
    private host: ElementRef,
    private anchorService: AnchorService,
    @Optional() private withAnchor: WithAnchorDirective
  ) { }

  ngOnInit(): void {
    const el = this.host.nativeElement as HTMLElement

    // if (this.isHeader) {
    //   this.anchorService.registerAnchor(el, this.group, true)
    // } else {
    //   this.anchorService.registerAnchor(el, this.group)
    // }

      this.anchorService.register(el, {
        id: this.id as string,
        parent: !!this.withAnchor ? this.withAnchor.id : null
      })
  }
}
