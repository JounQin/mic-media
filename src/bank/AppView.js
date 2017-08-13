import {$, Bb, Mn} from './common/index'

import HeaderView from './HeaderView'

import FlashContainer from './flash/FlashContainer'
import PanoramaContainer from './panorama/PanoramaContainer'
import PhotoContainer from './photo/PhotoContainer'
import TrashContainer from './trash/TrashContainer'
import VideoContainer from './video/VideoContainer'

const MAIN_VIEWS = {
  flash: FlashContainer,
  panorama: PanoramaContainer,
  photo: PhotoContainer,
  trash: TrashContainer,
  video: VideoContainer
}

const $win = $(window)
const $body = $('body')

export default Mn.View.extend({
  id: 'app',
  className: 'material-library',
  template: `<div class="header-region"></div><div class="main-region"></div>`,
  regions: {
    header: '.header-region',
    main: '.main-region'
  },
  model: new Bb.Model({
    activeType: 'photo'
  }),
  modelEvents: {
    change: 'render'
  },
  childViewEvents: {
    toggleActiveType(activeType) {
      this.model.set({activeType})
    },
    toggleSearch(active) {
      this.$('.main')[active ? 'addClass' : 'removeClass']('search-active')
    },
    searchPhotos(keyword) {
      this.getChildView('main').searchPhotos(keyword)
    }
  },
  initialize() {
    $win.on('resize', () => this.resize())
    this.resize()
  },
  resize() {
    $body[$win.width() <= 1280 ? 'addClass' : 'removeClass']('small-x')
  },
  onRender() {
    const activeType = this.model.get('activeType')
    this.showChildView('header', new HeaderView({activeType}))
    this.showChildView('main', new MAIN_VIEWS[activeType]())
  }
})
