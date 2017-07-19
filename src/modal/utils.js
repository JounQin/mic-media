import $ from 'jquery'

export const map = (arr, callback, context = arr) => {
  const result = []

  for (let i = 0, len = arr.length; i < len; i++) {
    result[i] = callback.call(context, arr[i], i, arr)
  }

  return result
}

export const on = ($el, events) => {
  for (let key in events) {
    if (!events.hasOwnProperty(key)) return
    const callback = events[key]
    key = $.trim(key)
    const arr = key.split(/\s+/)
    if (arr.length === 1) {
      $el.on(key, callback)
    } else {
      const event = arr.shift()
      $el.on(event, arr.join(' '), callback)
    }
  }
}
