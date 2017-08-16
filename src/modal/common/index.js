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

const alertTitle = $("<div class='alert-title'></div>")
alertTitle.css({
  left: '0px',
  top: '0px',
  background: 'rgb(255,255,255)',
  'border-radius': '3px',
  'box-shadow': 'rgba(0,0,0,0.247059) 2px 2px 4px 0px',
  border: '1px solid rgb(218,226,237)',
  padding: '3px 8px',
  position: 'absolute',
  display: 'none',
  'word-wrap': 'break-word',
  'z-index': '999'
})
$('body').append(alertTitle)

export const showTitle = (target, text) => {
  $('.alert-title').css({left: target.pageX - 20 + 'px', top: target.pageY + 20 + 'px', display: 'block'}).html(text)
}

window.I18N = I18N
