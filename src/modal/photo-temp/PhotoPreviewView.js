import {$, Bb, Mn} from '../common'

import template from './photo-preview-view.html'

export default Mn.View.extend({
  className: 'photo-preview',
  template,
  modelEvents: {
    change: 'render'
  },
  events: {
    'click .J-close-dialog'() {
      this.trigger('closeDialog')
    },
    'click [data-index]'(e) {
      this.model.set({
        currIndex: $(e.currentTarget).data('index')
      })
    }
  },
  initialize({photos, currIndex}) {
    this.model = new Bb.Model({
      photos,
      currIndex
    })
  }
})
