import { InjectionToken } from '@angular/core'
import { AnimationOpts } from '../utils/scroll'

export const SCROLL_CONFIG = new InjectionToken<AnimationOpts>('scroll.config')
