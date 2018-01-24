export interface Anchor {
  id: number,
  el: HTMLElement,
  text?: string,
  children?: Anchor[]
}

export type animationFunc = (step: number, start: number, change: number, duration: number) => number

export interface AnchorScrollConfig {
  duration?: number,
  step?: number,
  sensitivity?: number,
  timeFunc?: animationFunc
}
