import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { PageNavigatorModule } from './page-navigator/page-navigator.module'


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PageNavigatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
