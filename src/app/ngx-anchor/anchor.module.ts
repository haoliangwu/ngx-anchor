import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NavigatorComponent } from './navigator/navigator.component'
import { NavigatorItemComponent } from './navigator/navigator-item.component'
import { AnchorDirective } from './anchor.directive'
import { WithAnchorDirective } from './with-anchor.directive'
import { AnchorService } from './anchor.service'
import { SCROLL_CONFIG } from './config'
import { AnchorScrollConfig } from './model'
import { ValuesPipe } from './pipes/values.pipe'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NavigatorComponent,
    NavigatorItemComponent,
    AnchorDirective,
    WithAnchorDirective,
    ValuesPipe
  ],
  exports: [
    NavigatorComponent,
    AnchorDirective,
    WithAnchorDirective
  ]
})
export class NgxAnchorModule {
  static forRoot(options: AnchorScrollConfig = { sensitivity: 12 }): ModuleWithProviders {
    return {
      ngModule: NgxAnchorModule,
      providers: [
        {
          provide: SCROLL_CONFIG,
          useValue: options
        },
        AnchorService,
      ]
    }
  }
}
