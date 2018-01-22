export function getElementTop(element: HTMLElement): number {
  let actualTop

  if (element.getBoundingClientRect) {
    actualTop = element.getBoundingClientRect().top + document.documentElement.scrollTop
  } else {
    actualTop = element.offsetTop
    let current = element.offsetParent as HTMLElement

    while (current !== null) {
      actualTop += current.offsetTop
      current = current.offsetParent as HTMLElement
    }
  }

  return actualTop
}

export function getElementViewTop(element: HTMLElement) {
  if (element.getBoundingClientRect) {
    return element.getBoundingClientRect().top
  } else {
    const actualTop = getElementTop(element)

    let elementScrollTop

    if (document.compatMode === 'BackCompat') {
      elementScrollTop = document.body.scrollTop
    } else {
      elementScrollTop = document.documentElement.scrollTop
    }

    return actualTop - elementScrollTop
  }
}

export function isScrollToBottom(element: HTMLElement = document.documentElement) {
  return (element.scrollTop === (element.scrollHeight - element.offsetHeight))
}
