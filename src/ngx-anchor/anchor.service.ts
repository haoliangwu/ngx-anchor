import { Injectable, Inject, InjectionToken } from '@angular/core'
import { Anchor, AnchorScrollConfig, AnchorRegistry } from './model'
import { getElementViewTop, closestScrollableElement, isScrollToBottom, isScrollToTop } from '../utils/dom'
import { scrollTo } from '../utils/scroll'

import { Observable } from 'rxjs/Observable'
import { fromEvent } from 'rxjs/observable/fromEvent'
import { of } from 'rxjs/observable/of'
import { never } from 'rxjs/observable/never'
import { from } from 'rxjs/observable/from'
import { flatMap, tap, map, bufferCount, switchMap, distinctUntilChanged, throttleTime } from 'rxjs/operators'
import { SCROLL_CONFIG } from './config'

@Injectable()
export class AnchorService {
  private uuid = 1
  private enable = true
  public scrollOptions: AnchorScrollConfig
  anchors: AnchorRegistry = {}
  activeAnchor: Anchor

  constructor(
    @Inject(SCROLL_CONFIG) scrollOptions
  ) {
    this.scrollOptions = scrollOptions
  }

  registerAnchor(el: HTMLElement, { id, parent }) {
    const uuid = this.uuid++

    const anchor = {
      uuid,
      id: id as string,
      parent: parent as string,
      el: el,
      children: []
    }

    if (!this.activeAnchor) {
      this.activeAnchor = anchor
    }

    this.anchors[id] = anchor

    if (!!parent && this.anchors[parent]) {
      this.anchors[parent].children.push(id)
    }
  }

  isAnchorInView(top: number) {
    return top >= 0 && top <= document.documentElement.clientHeight
  }

  isAnchorActive(top: number) {
    const { sensitivity } = this.scrollOptions

    return top >= 0 && top <= sensitivity
  }

  scrollToAnchor(anchor: Anchor, scrollOptions?: AnchorScrollConfig) {
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
      throttleTime(10),
      distinctUntilChanged(),
      map(() => {
        const anchors = Object.values(this.anchors)

        // 如果滚动到最顶端 则直接返回第一个 anchor
        if (isScrollToTop()) {
          return anchors[0]
        }

        // 如果滚动到最底端 则直接返回最后一个 anchor
        if (isScrollToBottom()) {
          return this.findDeepestAnchor(anchors[anchors.length - 1])
        }

        return this.findActiveAnchor(anchors)
      }),
      tap(activeAnchor => {
        this.activeAnchor = activeAnchor
      })
    )
  }

  private findActiveAnchor(anchors: Array<Anchor | string> = []): Anchor {
    let anchor: Anchor = null

    for (let i = 0; i < anchors.length; i++) {
      anchor = this.getAnchor(anchors[i])

      const top = getElementViewTop(anchor.el)

      // 如果 anchor 可见
      if (this.isAnchorInView(top)) {
        // 如果 anchor 距窗口顶部距离大于 sensitivity，则返回上一条 anchor
        if (!this.isAnchorActive(top)) {
          anchor = i === 0 ? anchor : this.findDeepestAnchor(anchors[i - 1])
        }
      } else {
        anchor = this.findActiveAnchor(anchor.children)
      }

      if (!!anchor) break
    }

    return anchor
  }

  private findDeepestAnchor(anchor: Anchor | string): Anchor {
    anchor = this.getAnchor(anchor)

    if (anchor.children && anchor.children.length > 0) {
      return this.findDeepestAnchor(anchor.children[anchor.children.length - 1])
    } else {
      return anchor
    }
  }

  private getAnchor(anchor: Anchor | string) {
    if (!(anchor instanceof Object)) {
      return this.anchors[anchor as string]
    } else {
      return anchor as Anchor
    }
  }

  private toggleListner(status: boolean) {
    this.enable = status
  }
}
