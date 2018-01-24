import { Injectable, Inject, InjectionToken } from '@angular/core'
import { Anchor, AnchorScrollConfig } from './model'
import { getElementViewTop, closestScrollableElement, isScrollToBottom } from '../utils/dom'
import { scrollTo, AnimationOpts } from '../utils/scroll'

import { Observable } from 'rxjs/Observable'
import { fromEvent } from 'rxjs/observable/fromEvent'
import { of } from 'rxjs/observable/of'
import { never } from 'rxjs/observable/never'
import { from } from 'rxjs/observable/from'
import { debounceTime, flatMap, tap, map, bufferCount, switchMap, distinctUntilChanged } from 'rxjs/operators'
import { SCROLL_CONFIG } from './config'

@Injectable()
export class AnchorService {
  private uniqId = 1
  private enable = true
  public scrollOptions: AnchorScrollConfig
  anchors: Anchor[] = []
  activeAnchor: Anchor

  constructor(
    @Inject(SCROLL_CONFIG) scrollOptions
  ) {
    this.scrollOptions = scrollOptions
  }

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

  isAnchorInView(top: number) {
    return top >= 0 && top <= document.documentElement.clientHeight
  }

  isAnchorActive(top: number, height: number) {
    const { sensitivity } = this.scrollOptions

    return top >= 0 && top <= height + sensitivity
  }

  scrollToAnchor(anchor: Anchor, scrollOptions?: AnimationOpts) {
    this.toggleListner(false)

    const scrollElement = closestScrollableElement(anchor.el)

    const scrollTop = scrollElement.scrollTop
    const scrollOffset = getElementViewTop(anchor.el)

    scrollTo(scrollElement, {
      start: scrollTop,
      change: scrollOffset,
      ...this.scrollOptions,
      ...scrollOptions
    }, () => {
      this.toggleListner(true)
    })

    this.activeAnchor = anchor
  }

  attachListner(el: HTMLElement | Window = window) {
    const toggle$ = switchMap(event => this.enable ? of(event) : never())

    return fromEvent(el, 'scroll').pipe(
      toggle$,
      distinctUntilChanged(),
      map(event => {
        const length = this.anchors.length

        // 如果滚动到最底端 则直接返回最后一个 anchor
        if (isScrollToBottom()) {
          return this.anchors[this.anchors.length - 1]
        }

        let anchor: Anchor = null

        for (let i = 0; i < this.anchors.length; i++) {
          anchor = this.anchors[i]

          const top = getElementViewTop(anchor.el)
          const clientHeight = anchor.el.clientHeight

          // 如果 anchor 可见
          if (this.isAnchorInView(top)) {
            // 如果 anchor 距窗口顶部距离大于 sensitivity，则返回上一条 anchor
            if (!this.isAnchorActive(top, clientHeight)) {
              anchor = this.anchors[i - 1]
            }

            // 反之 返回当前 anchor
            break
          }
        }

        return anchor
      }),
      tap(activeAnchor => {
        this.activeAnchor = activeAnchor
      })
    )
  }

  private toggleListner(status: boolean) {
    this.enable = status
  }
}
