import { Component, OnInit, Input, ViewEncapsulation, TemplateRef, EventEmitter, Output } from '@angular/core'
import { Anchor } from '../model'
import { AnchorService } from '../anchor.service'

@Component({
  selector: 'ngx-navigator-item',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './navigator-item.component.html'
})
export class NavigatorItemComponent implements OnInit {
  @Input() anchors: Anchor[]
  @Input() itemTpl: TemplateRef<Anchor>
  @Input() sub: boolean

  @Output() clickRquest: EventEmitter<Anchor> = new EventEmitter<Anchor>()

  constructor(
    public anchorService: AnchorService
  ) { }

  ngOnInit() {
  }

  handleClick(anchor: Anchor) {
    this.clickRquest.emit(anchor)
  }
}
