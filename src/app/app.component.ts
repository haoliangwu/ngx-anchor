import { Component, OnInit, Renderer2 } from '@angular/core'
import { AnchorService } from './ngx-anchor/anchor.service'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs/Observable'
import { Anchor } from './ngx-anchor/model'
import { tap } from 'rxjs/operators/tap'

@Component({
  selector: 'ngx-anchor-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app'
  contents = []
  activeAnchorIds$: Observable<string>

  constructor(
    public anchorService: AnchorService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    for (let i = 1; i <= 8; i++) {
      if (i % 2 === 0) {
        this.contents.push({
          id: `${i}`,
          children: [1, 2, 3].map(idx => {
            return {
              id: `${i}-${idx}`,
              height: this.randomHeight(),
              children: i === 2 ? [1, 2, 3].map(idx2 => {
                return {
                  id: `${i}-${idx}-${idx2}`,
                  height: this.randomHeight(),
                  children: []
                }
              }) : []
            }
          })
        })
      } else {
        this.contents.push({
          id: i,
          children: []
        })
      }
    }

    this.activeAnchorIds$ = this.anchorService.scrollEvents.pipe(
      tap(e => {
        console.log(e)
      }),
      map(e => e.anchor.id)
    )
  }

  scrollTo(id: string) {
    this.anchorService.scrollTo(id, this.renderer)
  }

  private randomHeight() {
    return 30 * Math.random() + 'vh'
  }
}
