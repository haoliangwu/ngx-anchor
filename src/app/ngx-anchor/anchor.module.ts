import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NavigatorComponent } from './navigator.component'
import { AnchorDirective } from './anchor.directive'
import { AnchorService } from './anchor.service'
import { AnimationOpts } from 'utils/scroll'



@NgModule({
  imports: [
    CommonModule
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
export class NgxAnchorModule {
  static forRoot(options?: AnimationOpts): ModuleWithProviders {
    return {
      ngModule: NgxAnchorModule,
      providers: [
        {
          provide: AnchorService,
          useFactory: function () {
            return new AnchorService(options)
          },
        }
      ]
    }
  }
}
