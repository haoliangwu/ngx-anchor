import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { NgxAnchorModule } from './ngx-anchor/anchor.module'

import { NgZorroAntdModule } from 'ng-zorro-antd'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgZorroAntdModule.forRoot(),
    NgxAnchorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
