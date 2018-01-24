import { isScrollToBottom } from './dom'
import { AnchorScrollConfig } from '../ngx-anchor/model';

let scrollAnimationFrame

export interface ScrollOpts extends AnchorScrollConfig {
  start: number,
  change: number
}

function easeOut(step: number, start: number, change: number, duration: number): number {
  return -change * (step /= duration) * (step - 2) + start
}

export function scrollTo(scrollElement: HTMLElement,
  options: ScrollOpts, callback: Function) {

  const { start, change, duration = 300, step = 10, timeFunc = easeOut } = options

  let t = 0

  function doScroll() {
    // avoid trigger repeatly when scroll bar already bound to bottom
    if (change > 0 && isScrollToBottom(scrollElement)) {
      callback()
      return cancelAnimationFrame(scrollAnimationFrame)
    }

    if (scrollAnimationFrame) {
      cancelAnimationFrame(scrollAnimationFrame)
    }

    scrollElement.scrollTop = easeOut(t, start, change, duration)

    t += step

    if (t > duration) {
      callback()
      cancelAnimationFrame(scrollAnimationFrame)
    } else {
      scrollAnimationFrame = requestAnimationFrame(doScroll)
    }
  }

  scrollAnimationFrame = requestAnimationFrame(doScroll)
}
