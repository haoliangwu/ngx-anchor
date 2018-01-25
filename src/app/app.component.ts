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
          id: `${i}`,
          children: [1, 2, 3].map(idx => {
            const height = 30 * Math.random()

            return {
              id: `${i}-${idx}`,
              height: height + 'vh',
              children: i === 2 ? [4].map(idx2 => {
                return {
                  id: `${i}-${idx}-${idx2}`,
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
