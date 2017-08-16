import {$, Bb, Mn, API, PagerView, showTips} from '../common'

import VideoView from './VideosView'
import template from './video-container.html'

const VIEW_TYPES = ['thumbnail', 'list']

export default Mn.View.extend({
  className: 'main video-container',
  template,
  model: new Bb.Model({
    viewType: 'thumbnail',
    currPage: '1',
    totalPage: '1'
  }),
  regions: {
    tabs: '.tabs-region',
    video: '.video-region',
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
      this.getVideos(nextPage)
    },
    'click .J-confirm'() {
      if ($('input[type="radio"]:checked').length === 0) {
        showTips('aaa')
      }
    }
  },
  modelEvents: {
    change: 'render'
  },
  childViewEvents: {
    togglePage(currPage) {
      this.fetchVideos({currPage})
    }
  },
  initialize() {
    this.getFullVideoData()
  },
  fetchVideos(params) {
    return this.getFullVideoData(params)
  },
  getVideos(currPage) {
    currPage = currPage || this.getChildView('pager').model.get('currPage')
    this.fetchVideos({currPage})
  },
  getFullVideoData(params = {currPage: 1}) {
    const container = this.model
    const {currPage} = params
    API.getFlash(params).done(({data}) => {
      const {media, pager, viewType} = data
      container.set({
        currPage: Math.min(currPage, pager.totalPage),
        media,
        ...pager,
        viewType
      })
    })
  },
  onRender() {
    const container = this.model
    const viewType = container.get('viewType')
    const media = container.get('media')

    this.showChildView(viewType === 'thumbnail' ? 'video' : 'tbody', new VideoView({video: media, viewType: viewType}))
    this.showChildView(
      'pager',
      new PagerView({
        pager: {currPage: container.get('currPage'), totalPage: container.get('totalPage')}
      })
    )
  }
})
