import { Component } from '@angular/core'

@Component({
  selector: 'ngx-anchor-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app'
  contents = []

  constructor() {
    for (let i = 1; i <= 10; i++) {
      if (i % 2 === 0) {
        this.contents.push({
          id: i,
          children: [1, 2, 3].map(idx => {
            return {
              id: idx,
              height: 30 * Math.random() + 'vh'
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
}
