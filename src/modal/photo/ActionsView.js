import {$, Mn, API, I18N, mapState} from '../common'

import template from './actions-view.html'

const VIEW_TYPES = ['thumbnail', 'list']

export default Mn.View.extend({
  className: 'actions',
  template,
  modelEvents: {
    change: 'render'
  },
  events: {
    'click .J-toggle-list-type .ob-icon'(e) {
      const viewType = VIEW_TYPES[$(e.currentTarget).index()]
      this.options.container.set({viewType})
      API.switchViewType(viewType)
    },
    'click .J-toggle-sort-type'(e) {
      const {container} = this.options

      let sortType = container.get('sortType')
      let reverse = container.get('reverse')
      const activeType = $(e.currentTarget).data('type')

      if (sortType !== activeType) {
        sortType = activeType
        reverse = false
      } else if (reverse) {
        sortType = null
        reverse = false
      } else {
        reverse = true
      }

      container.set({sortType, reverse})
    }
  },
  initialize({container}) {
    mapState(this, container, ['sortType', 'reverse', 'viewType'])
    this.model.set({sortTypes: I18N.sortTypes})
  }
})
