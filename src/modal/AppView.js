import {Mn} from './common/index'

import FlashContainer from './flash/FlashContainer'
import PanoramaContainer from './panorama/PanoramaContainer'
import PhotoContainer from './photo/PhotoContainer'

const Container = {
  Flash: FlashContainer,
  Panorama: PanoramaContainer,
  Photo: PhotoContainer
}

export default Mn.View.extend({
  id: 'app',
  className: 'material-library',
  template: `<div class="main-region"></div>`,
  regions: {
    main: '.main-region'
  },
  modelEvents: {
    change: 'render'
  },
  childViewEvents: {
    toggleActiveType(activeType) {
      this.model.set({activeType})
    },
    // toggleSearch(active) {
    //   this.$('.main')[active ? 'addClass' : 'removeClass']('search-active')
    // },
    searchPhotos(keyword) {
      this.getChildView('main').searchPhotos(keyword)
    }
  },
  onRender() {
    // eslint-disable-next-line new-cap
    this.showChildView('main', new Container['Photo']())
    // this.showChildView('main', new Container['Flash']())
    // this.showChildView('main', new Container['Panorama']())
  }
})
