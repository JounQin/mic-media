import { _, Mn, $ } from './lib'

import AppView from './AppView'

Mn.View.setRenderer((template, data) => {
  switch (typeof template) {
    case 'function':
      return template(data)
    case 'string':
      if (!/^<[\s\S]+\/?>$/.test(template)) {
        try {
          template = $(template).html() || template
        } catch (e) {
        }
      }
      return _.template(template)(data)
    default:
      throw new Error('template should be a function or string')
  }
})

new AppView() // eslint-disable-line no-new
