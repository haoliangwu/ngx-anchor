import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NavigatorComponent } from './navigator.component'
import { AnchorDirective } from './anchor.directive'
import { AnchorService } from './anchor.service'

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AnchorService
  ],
  declarations: [
    NavigatorComponent,
    AnchorDirective
  ],
  exports: [
    NavigatorComponent,
    AnchorDirective
  ]
})
export class PageNavigatorModule { }
