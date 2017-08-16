import {Mn} from './common/index'

import FlashContainer from './flash/FlashContainer'
import PanoramaContainer from './panorama/PanoramaContainer'
import PhotoContainer from './photo/PhotoContainer'
import VideoContainer from './video/VideoContainer'

const Container = {
  flash: FlashContainer,
  panorama: PanoramaContainer,
  photo: PhotoContainer,
  video: VideoContainer
}

const TYPES = ['photo', 'flash', 'panorama', 'video']

export default Mn.View.extend({
  id: 'app',
  className: 'material-library',
  template: `<div class="main-region"></div>`,
  regions: {
    header: '.header-region',
    main: '.main-region'
  },
  onRender() {
    const matched = location.search.match(/^\?activeType=(\w+)/)
    const matchedActiveType = matched && matched[1]
    const activeType = TYPES.indexOf(matchedActiveType) === -1 ? TYPES[0] : matchedActiveType

    // eslint-disable-next-line new-cap
    this.showChildView('main', new Container[activeType]())
  }
})
