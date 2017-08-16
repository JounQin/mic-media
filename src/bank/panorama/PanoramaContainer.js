import {$, Bb, Mn, API, PagerView} from '../common'

import PanoramaView from './PanoramaView'
import template from './panorama-container.html'

const VIEW_TYPES = ['thumbnail', 'list']

export default Mn.View.extend({
  className: 'main panorama-container',
  template,
  regions: {
    tabs: '.tabs-region',
    panorama: '.panorama-region',
    tbody: {
      el: 'tbody',
      replaceElement: true
    },
    pager: '.pager-region'
  },
  model: new Bb.Model({
    viewType: 'thumbnail',
    currPage: '1',
    totalPage: '1',
    length: 0,
    hasPanoramaService: false
  }),
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
    }
  },
  modelEvents: {
    change: 'render'
  },
  childViewEvents: {
    togglePage(currPage) {
      this.fetchPanorama({currPage})
    }
  },
  initialize() {
    this.getFullPanoramaData()
  },
  fetchPanorama(params) {
    return this.getFullPanoramaData(params)
  },
  getFlashes(currPage) {
    currPage = currPage || this.getChildView('pager').model.get('currPage')
    this.fetchPanorama({currPage})
  },
  getFullPanoramaData(params = {currPage: 1}) {
    const container = this.model
    const {currPage} = params
    API.getPanorama(params).done(({data}) => {
      const {media, pager, viewType, hasPanoramaService} = data
      container.set({
        currPage: Math.min(currPage, pager.totalPage),
        media,
        ...pager,
        viewType,
        length: media.length,
        hasPanoramaService
      })
    })
  },
  onRender() {
    const container = this.model
    const viewType = container.get('viewType')
    const media = container.get('media')
    const length = container.get('length')
    const hasPanoramaService = container.get('hasPanoramaService')

    if (hasPanoramaService === true && length > 0) {
      this.showChildView(
        viewType === 'thumbnail' ? 'panorama' : 'tbody',
        new PanoramaView({panorama: media, viewType: viewType})
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
