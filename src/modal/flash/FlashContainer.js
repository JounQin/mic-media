import {$, Bb, Mn, API, I18N, PagerView, showTips} from '../common'

import FlashView from './FlashView'
import template from './flash-container.html'

const VIEW_TYPES = ['thumbnail', 'list']

export default Mn.View.extend({
  className: 'main flash-container',
  template,
  model: new Bb.Model({
    viewType: 'thumbnail',
    currPage: '1',
    totalPage: '1',
    length: 0
  }),
  regions: {
    tabs: '.tabs-region',
    flash: '.flash-region',
    tbody: {
      el: 'tbody',
      replaceElement: true
    },
    pager: '.pager-region'
  },
  events: {
    'click .J-toggle-list-type .ob-icon'(e) {
      const viewType = VIEW_TYPES[$(e.currentTarget).index()]
      this.model.set({viewType})
      API.switchViewType(viewType)
    },
    'click .J-toggle-page'(e) {
      const $el = $(e.currentTarget)
      if ($el.prop('disabled')) return
      const nextPage = $el.data('page')
      this.getFlashes(nextPage)
    },
    'click .J-confirm'() {
      if ($('input[type="radio"]:checked').length === 0) {
        showTips(I18N.flashTips)
      }
    }
  },
  modelEvents: {
    change: 'render'
  },
  childViewEvents: {
    togglePage(currPage) {
      this.fetchFlashes({currPage})
    }
  },
  initialize() {
    this.getFullFlashData()
  },
  fetchFlashes(params) {
    return this.getFullFlashData(params)
  },
  getFlashes(currPage) {
    currPage = currPage || this.getChildView('pager').model.get('currPage')
    this.fetchFlashes({currPage})
  },
  getFullFlashData(params = {currPage: 1}) {
    const container = this.model
    const {currPage} = params
    API.getFlash(params).done(({data}) => {
      const {media, pager, viewType} = data
      container.set({
        currPage: Math.min(currPage, pager.totalPage),
        media,
        ...pager,
        viewType,
        length: media.length
      })
    })
  },
  onRender() {
    const container = this.model
    const viewType = container.get('viewType')
    const media = container.get('media')
    const length = container.get('length')

    if (length > 0) {
      this.showChildView(
        viewType === 'thumbnail' ? 'flash' : 'tbody',
        new FlashView({flash: media, viewType: viewType})
      )
      this.showChildView(
        'pager',
        new PagerView({
          pager: {currPage: container.get('currPage'), totalPage: container.get('totalPage')}
        })
      )
    }
  }
})
