import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core'
import { AnchorService } from './anchor.service'
import { getElementViewTop, isScrollToBottom } from './utils'
import { Anchor } from './model'

import { Subscription } from 'rxjs/Subscription'

@Component({
  selector: 'pn-navigator',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})
export class NavigatorComponent implements OnInit, OnDestroy {
  private scroll$$: Subscription
  private isClosed = false

  constructor(
    private anchorService: AnchorService
  ) { }

  ngOnInit() {
    this.scroll$$ = this.anchorService.attachListner().subscribe()
  }

  ngOnDestroy() {
    this.scroll$$.unsubscribe()
  }

  trackByFn(idx: number, anchor: Anchor) {
    return anchor.id
  }

  handleClick(anchor: Anchor) {
    this.anchorService.scrollToAnchor(anchor)
  }
}
