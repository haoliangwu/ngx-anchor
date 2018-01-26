import { Injectable, Inject, InjectionToken } from '@angular/core'
import { Anchor, AnchorScrollConfig, AnchorRegistry, AnchorRelConstriant, ScrollEvent } from './model'
import { getElementViewTop, closestScrollableElement, isScrollToBottom, isScrollToTop } from '../utils/dom'
import { scrollTo as _scrollTo } from '../utils/scroll'

import { Observable } from 'rxjs/Observable'
import { fromEvent } from 'rxjs/observable/fromEvent'
import { of } from 'rxjs/observable/of'
import { never } from 'rxjs/observable/never'
import { from } from 'rxjs/observable/from'
import { flatMap, tap, map, bufferCount, switchMap, distinctUntilChanged, throttleTime } from 'rxjs/operators'
import { SCROLL_CONFIG } from './config'

import { Subject } from 'rxjs/Subject'

@Injectable()
export class AnchorService {
  private uuid = 1
  private enable = true
  private scroll$ = new Subject<ScrollEvent>()
  private scrollOptions: AnchorScrollConfig

  anchors: AnchorRegistry = {}
  activeAnchor: Anchor

  get scrollEvents(): Subject<ScrollEvent> {
    return this.scroll$
  }

  constructor(
    @Inject(SCROLL_CONFIG) scrollOptions
  ) {
    this.scrollOptions = scrollOptions
  }

  anchorFactory(el: HTMLElement, constraint: AnchorRelConstriant): Anchor {
    return {
      uuid: this.uuid++,
      el: el,
      children: [],
      ...constraint
    }
  }

  get(id: string | Anchor): Anchor {
    if (typeof id === 'string' || typeof id === 'number') {
      return this.anchors[id]
    } else {
      return id
    }
  }

  register(el: HTMLElement, constraint: AnchorRelConstriant) {
    const { id, parent } = constraint

    const anchor = this.anchorFactory(el, constraint)

    if (!this.activeAnchor) {
      this.activeAnchor = anchor
    }

    this.anchors[id] = anchor

    if (!!parent && this.anchors[parent]) {
      this.anchors[parent].children.push(id)
    }
  }

  scrollTo(anchor: Anchor | string, scrollOptions?: AnchorScrollConfig) {
    anchor = this.get(anchor)

    this.toggleListner(false)

    const scrollElement = closestScrollableElement(anchor.el)

    const scrollTop = scrollElement.scrollTop
    const scrollOffset = getElementViewTop(anchor.el)

    _scrollTo(scrollElement, {
      start: scrollTop,
      change: scrollOffset,
      ...this.scrollOptions,
      ...scrollOptions
    }, () => {
      this.toggleListner(true)

      // trigger scroll event manually
      this.scroll$.next({ anchor: this.activeAnchor })
    })

    this.activeAnchor = anchor
  }

  attachListner(el: HTMLElement | Window = window): Observable<Anchor> {
    const toggle$ = switchMap(event => this.enable ? of(event) : never())

    return fromEvent(el, 'scroll').pipe(
      toggle$,
      throttleTime(10),
      distinctUntilChanged(),
      map(() => {
        const anchors = Object.values(this.anchors)
        let activeAnchor

        // 如果滚动到最顶端 则直接返回第一个 anchor
        if (isScrollToTop()) {
          activeAnchor = anchors[0]

          return activeAnchor
        }

        // 如果滚动到最底端 则直接返回最后一个 anchor
        if (isScrollToBottom()) {
          activeAnchor = this.findDeepestAnchor(anchors[anchors.length - 1])

          return activeAnchor
        }

        activeAnchor = this.findActiveAnchor(anchors)

        return activeAnchor
      }),
      tap(activeAnchor => {
        this.scroll$.next({ anchor: activeAnchor })
        this.activeAnchor = activeAnchor
      })
    )
  }

  private findActiveAnchor(anchors: Array<Anchor | string> = []): Anchor {
    let anchor: Anchor = null

    for (let i = 0; i < anchors.length; i++) {
      anchor = this.get(anchors[i])

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
    anchor = this.get(anchor)

    if (anchor.children && anchor.children.length > 0) {
      return this.findDeepestAnchor(anchor.children[anchor.children.length - 1])
    } else {
      return anchor
    }
  }

  private toggleListner(status: boolean) {
    this.enable = status
  }

  private isAnchorInView(top: number) {
    return top >= 0 && top <= document.documentElement.clientHeight
  }

  private isAnchorActive(top: number) {
    return top >= 0 && top <= this.scrollOptions.sensitivity
  }
}
