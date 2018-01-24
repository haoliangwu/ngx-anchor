import { Directive, ElementRef, Input } from '@angular/core'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks'
import { getElementTop, getElementViewTop } from '../utils/dom'
import { AnchorService } from './anchor.service'

@Directive({
  selector: '[ngxAnchor]'
})
export class AnchorDirective implements OnInit {
  @Input('ngxAnchor') group: string
  @Input('header') isHeader: boolean

  constructor(
    private host: ElementRef,
    private anchorService: AnchorService
  ) { }

  ngOnInit(): void {
    const el = this.host.nativeElement as HTMLElement

    if (this.isHeader) {
      this.anchorService.registerAnchor(el, this.group, true)
    } else {
      this.anchorService.registerAnchor(el, this.group)
    }
  }
}
