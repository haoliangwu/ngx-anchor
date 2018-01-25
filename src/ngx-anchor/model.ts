export interface Anchor {
  uuid: number,
  id: string,
  el: HTMLElement,
  text?: string,
  parent?: string,
  children?: Anchor[]
}

export interface AnchorRegistry { [id: string]: Anchor }

export type animationFunc = (step: number, start: number, change: number, duration: number) => number

export interface AnchorScrollConfig {
  duration?: number,
  step?: number,
  sensitivity?: number,
  timeFunc?: animationFunc
}
