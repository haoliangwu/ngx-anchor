import { Injectable } from '@angular/core'
import { Anchor } from './model'
import { getElementViewTop, scrollTo, closestScrollableElement, isScrollToBottom } from './utils'

import { fromEvent } from 'rxjs/observable/fromEvent'
import { of } from 'rxjs/observable/of'
import { never } from 'rxjs/observable/never'
import { from } from 'rxjs/observable/from'
import { debounceTime, flatMap, tap, map, bufferCount, switchMap } from 'rxjs/operators'

@Injectable()
export class AnchorService {
  private uniqId = 1
  private enable = true
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

  isActiveAnchor(el: HTMLElement) {
    const top = getElementViewTop(el)
    const clientHeight = el.clientHeight

    return top >= 0 && top <= (clientHeight + this.sensitivity)
  }

  scrollToAnchor(anchor: Anchor) {
    this.toggleListner(false)

    const scrollElement = closestScrollableElement(anchor.el)

    const scrollTop = scrollElement.scrollTop
    const scrollOffset = getElementViewTop(anchor.el)

    scrollTo(scrollElement, {
      start: scrollTop,
      change: scrollOffset,
      timeFunc: function easeOut(step, start, change, duration) {
        return -change * (step /= duration) * (step - 2) + start
      }
    }, () => {
      this.toggleListner(true)
    })

    this.activeAnchor = anchor
  }

  attachListner(el: HTMLElement | Window = window) {
    const toggle$ = switchMap(event => this.enable ? of(event) : never())

    return fromEvent(el, 'scroll').pipe(
      toggle$,
      map(event => {
        const length = this.anchors.length

        if (isScrollToBottom()) {
          return this.anchors.slice(length - 1)
        }

        return this.anchors
          .filter((anchor) => this.isActiveAnchor(anchor.el))
      }),
      tap(activeAnchors => {
        if (activeAnchors.length > 0) {
          this.activeAnchor = activeAnchors[0]
        }
      })
    )
  }

  toggleListner(status: boolean) {
    this.enable = status
  }
}
