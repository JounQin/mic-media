import './library.scss'

import {_, Marionette, $} from './lib'

import AppView from './App'

Marionette.View.setRenderer((template, data) => {
  switch (typeof template) {
    case 'function':
      return template(data)
    case 'string':
      /^<[\s\S]+\/?>$/.test(template) || (template = $(template).html() || template)
      return _.template(template)(data)
    default:
      throw new Error('template should be a function or string')
  }
})

new AppView() // eslint-disable-line no-new
