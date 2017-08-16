import * as API from './api'
import {default as I18N} from './i18n'
import {$, Bb} from './basic'

export * from './basic'
export {Pager, default as PagerView} from './PagerView'
export {default as artDialog} from 'art-dialog'

export {API}
export {I18N}
export const stores = {}

export const mapState = (view, store, keys) => {
  view.model = new Bb.Model(store.pick(keys))
  view.listenTo(store, keys.map(key => `change:${key}`).join(' '), () => view.model.set(store.pick(keys)))
}

export const showTips = (id, text, type = 'warn') => {
  if (!text) {
    text = id
    id = null
  }
  id = id || Date.now()
  if ($(`#${id}`).length) return
  const $tip = $(
    `<div id="${id}" class="alert-new toast"><div class="alert-con alert-disappear ${type}"><span class="alert-txt">${text}</span></div></div>`
  ).appendTo('body')
  setTimeout(() => $tip.remove(), 2000)
  return id
}

export const SPECIAL_CHAR_REG = /[\\/:*?”<>|]/

window.I18N = I18N
