import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { PageNavigatorModule } from './page-navigator/page-navigator.module'

import { NgZorroAntdModule } from 'ng-zorro-antd'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgZorroAntdModule.forRoot(),
    PageNavigatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
