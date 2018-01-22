import { Component } from '@angular/core'

@Component({
  selector: 'pn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app'
  contents = []

  constructor() {
    for (let i = 1; i <= 10; i++) {
      this.contents.push(i)
    }
  }
}
