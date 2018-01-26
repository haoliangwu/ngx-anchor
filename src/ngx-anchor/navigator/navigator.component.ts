import { Component, OnInit, ViewEncapsulation, OnDestroy, TemplateRef, ContentChild, ElementRef, Input, Output, EventEmitter } from '@angular/core'
import { AnchorService } from '../anchor.service'
import { getElementViewTop, isScrollToBottom } from '../../utils/dom'
import { Anchor } from '../model'

import { Subscription } from 'rxjs/Subscription'
import { AfterContentInit } from '@angular/core/src/metadata/lifecycle_hooks'

@Component({
  selector: 'ngx-anchor-nav',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})
export class NavigatorComponent implements OnInit, OnDestroy {
  private scroll$$: Subscription
  private isClosed = false

  @ContentChild('anchorTpl', { read: TemplateRef }) itemTpl: TemplateRef<Anchor>

  constructor(
    public anchorService: AnchorService
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
    this.anchorService.scrollTo(anchor)
  }
}
