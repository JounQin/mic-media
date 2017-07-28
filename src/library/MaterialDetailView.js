import {$, _, Bb, Mn} from './common'

import template from './material-detail-view.html'

export const MaterialDetail = Bb.Model.extend()

export default Mn.View.extend({
  className: 'material-detail-container',
  template,
  modelEvents: {
    change: 'render'
  },
  events: {
    'click [data-index]'(e) {
      const index = $(e.currentTarget).data('index')
      const {model} = this
      if (!_.isNumber(index) || index < 0 || index >= model.get('materials').length || index === model.get('currIndex')) return
      this.trigger('toggleMaterial', index)
    }
  }
})
