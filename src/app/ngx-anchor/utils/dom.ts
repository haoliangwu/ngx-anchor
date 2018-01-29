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

export function isScrollToTop(element: HTMLElement = document.documentElement) {
  return element.scrollTop === 0
}

export function isScrollToBottom(element: HTMLElement = document.documentElement) {
  return (element.scrollTop === (element.scrollHeight - element.offsetHeight))
}

export function hasOverflow(element: HTMLElement) {
  const overflowRegex = /(auto|scroll)/
  const computedStyles = getComputedStyle(element, null)

  const overflow = computedStyles.getPropertyValue('overflow') +
    computedStyles.getPropertyValue('overflow-y') +
    computedStyles.getPropertyValue('overflow-x')

  return overflowRegex.test(overflow)
}

export function closestScrollableElement(element) {
  const scrollableElement = closest(element, (currentElement) => hasOverflow(currentElement))

  return scrollableElement || document.scrollingElement || document.documentElement || null
}

const matchFunction = Element.prototype.matches ||
  Element.prototype.webkitMatchesSelector ||
  // Element.prototype.mozMatchesSelector ||
  Element.prototype.msMatchesSelector

/**
 * Get the closest parent element of a given element that matches the given
 * selector string or matching function
 *
 * @param {Element} element The child element to find a parent of
 * @param {String|Function} selector The string or function to use to match
 *     the parent element
 * @return {Element|null}
 */
export default function closest(element, value) {
  if (!element) {
    return null
  }

  const selector = value
  const callback = value
  const nodeList = value
  const singleElement = value

  function conditionFn(currentElement) {
    if (!currentElement) {
      return currentElement
    } else if (typeof value === 'string') {
      return matchFunction.call(currentElement, selector)
    } else if (value instanceof NodeList || value instanceof Array) {
      return [...nodeList].includes(currentElement)
    } else if (value instanceof HTMLElement) {
      return singleElement === currentElement
    } else if (typeof value === 'function') {
      return callback(currentElement)
    } else {
      return null
    }
  }

  let current = element

  do {
    current = current.correspondingUseElement || current.correspondingElement || current
    if (conditionFn(current)) {
      return current
    }
    current = current.parentNode
  } while (current && current !== document.body && current !== document)

  return null
}
