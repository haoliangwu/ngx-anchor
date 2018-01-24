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
      if (i === 2) {
        this.contents.push({
          id: i,
          text: i + 'foo',
          children: [1, 2, 3].map(idx => {
            const height = 30 * Math.random()

            return {
              id: idx,
              text: i + 'bar',
              height: height + 'vh',
              children: i === 2 ? [4].map(idx2 => {
                return {
                  id: idx2,
                  text: i + 'zoo',
                  height: '30px',
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
}
