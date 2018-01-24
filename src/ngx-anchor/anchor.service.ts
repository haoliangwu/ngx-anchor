import { Injectable, Inject, InjectionToken } from '@angular/core'
import { Anchor, AnchorScrollConfig } from './model'
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
  private uniqId = 1
  private enable = true
  public scrollOptions: AnchorScrollConfig
  anchors: { [groupName: string]: Anchor } = {}
  activeAnchor: Anchor

  constructor(
    @Inject(SCROLL_CONFIG) scrollOptions
  ) {
    this.scrollOptions = scrollOptions
  }

  registerAnchor(el: HTMLElement, group: string, isHeader = false) {
    const id = this.uniqId++

    const anchor = {
      id: id,
      el: el
    }

    if (isHeader) {
      this.anchors[group] = {
        ...anchor,
        children: []
      }
    } else {
      this.anchors[group].children.push(anchor)
    }

    if (!this.activeAnchor) {
      this.activeAnchor = anchor
    }
  }

  isAnchorInView(top: number) {
    return top >= 0 && top <= document.documentElement.clientHeight
  }

  isAnchorActive(top: number, height: number) {
    const { sensitivity } = this.scrollOptions

    return top >= 0 && top <= height + sensitivity
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

  private findActiveAnchor(anchors: Anchor[] = []): Anchor {
    let anchor: Anchor = null

    for (let i = 0; i < anchors.length; i++) {
      anchor = anchors[i]

      const top = getElementViewTop(anchor.el)
      const clientHeight = anchor.el.clientHeight

      // 如果 anchor 可见
      if (this.isAnchorInView(top)) {
        // 如果 anchor 距窗口顶部距离大于 sensitivity，则返回上一条 anchor
        if (!this.isAnchorActive(top, clientHeight)) {
          anchor = i === 0 ? anchor : this.findDeepestAnchor(anchors[i - 1])
        }
      } else {
        anchor = this.findActiveAnchor(anchor.children)
      }

      if (!!anchor) break
    }

    return anchor
  }

  private findDeepestAnchor(anchor: Anchor): Anchor {
    if (anchor.children && anchor.children.length > 0) {
      return this.findDeepestAnchor(anchor.children[anchor.children.length - 1])
    } else {
      return anchor
    }
  }

  private toggleListner(status: boolean) {
    this.enable = status
  }
}
