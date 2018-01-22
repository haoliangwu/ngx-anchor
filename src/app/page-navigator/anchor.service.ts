import { Injectable } from '@angular/core'
import { Anchor } from './model'
import { getElementViewTop } from './utils'

@Injectable()
export class AnchorService {
  private uniqId = 1
  anchors: Anchor[] = []
  activeAnchor: Anchor
  sensitivity = 30

  registerAnchor(el: HTMLElement) {
    const id = this.uniqId++
    const anchor = {
      id: id,
      el: el
    }

    if (!this.activeAnchor) {
      this.activeAnchor = anchor
    }

    this.anchors.push(anchor)
  }

  isAnchorActive(el: HTMLElement) {
    const top = getElementViewTop(el)
    const clientHeight = el.clientHeight

    return top >= 0 && top <= (clientHeight + this.sensitivity)
  }

  scrollToAnchor(anchor: Anchor) {
    // TODO with some animation
    anchor.el.scrollIntoView(true)

    this.activeAnchor = anchor
  }
}
