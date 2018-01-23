import { InjectionToken } from '@angular/core'
import { AnimationOpts } from 'app/utils/scroll'

export const SCROLL_CONFIG = new InjectionToken<AnimationOpts>('scroll.config')
