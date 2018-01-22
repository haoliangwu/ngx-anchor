import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { AnchorService } from './anchor.service'
import { fromEvent } from 'rxjs/observable/fromEvent'
import { from } from 'rxjs/observable/from'
import { debounceTime, flatMap, tap, map, bufferCount } from 'rxjs/operators'
import { Subscription } from 'rxjs/Subscription'
import { getElementViewTop, isScrollToBottom } from './utils'
import { Anchor } from './model'

@Component({
  selector: 'pn-navigator',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})
export class NavigatorComponent implements OnInit {
  private scroll$: Subscription

  constructor(
    private anchorService: AnchorService
  ) { }

  ngOnInit() {
    this.scroll$ = fromEvent(window, 'scroll').pipe(
      // debounceTime(100),
      map(event => {
        const length = this.anchorService.anchors.length

        if (isScrollToBottom()) {
          return this.anchorService.anchors.slice(length - 1)
        }

        return this.anchorService.anchors
          .filter((anchor) => this.anchorService.isAnchorActive(anchor.el))
      }),
      tap(activeAnchors => {
        if (activeAnchors.length > 0) {
          this.anchorService.activeAnchor = activeAnchors[0]
        }
      })
    ).subscribe()
  }

  trackByFn(idx: number, anchor: Anchor) {
    return anchor.id
  }

  handleClick(anchor: Anchor) {
    this.anchorService.scrollToAnchor(anchor)
  }
}
