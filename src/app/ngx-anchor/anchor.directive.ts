import { Directive, ElementRef } from '@angular/core'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks'
import { getElementTop, getElementViewTop } from '../utils/dom'
import { AnchorService } from './anchor.service'

@Directive({
  selector: '[ngxAnchor]'
})
export class AnchorDirective implements OnInit {
  constructor(
    private host: ElementRef,
    private anchorService: AnchorService
  ) { }

  ngOnInit(): void {
    const el = this.host.nativeElement as HTMLElement

    this.anchorService.registerAnchor(el)
  }
}
