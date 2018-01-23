import { isScrollToBottom } from './dom'

let scrollAnimationFrame

export type animationFunc = (step: number, start: number, change: number, duration: number) => number

export interface AnimationOpts {
  duration?: number,
  step?: number,
  timeFunc?: animationFunc
}

interface ScrollOpts extends AnimationOpts {
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
