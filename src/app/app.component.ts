import { Component, OnInit } from '@angular/core'
import { AnchorService } from '../ngx-anchor/anchor.service'

@Component({
  selector: 'ngx-anchor-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app'
  contents = []

  constructor(
    public anchorService: AnchorService
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
  }

  scrollTo(id: string) {
    this.anchorService.scrollToAnchor(id)
  }

  previous() {

  }

  next() {

  }

  private randomHeight() {
    return 30 * Math.random() + 'vh'
  }
}
