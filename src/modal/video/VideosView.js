import {Bb, Mn} from '../common'

import template from './video-view.html'

const VideoView = Mn.View.extend({
  className: 'video',
  tagName() {
    return this.model.attributes.viewType === 'thumbnail' ? 'li' : 'tr'
  },
  template
})

export default Mn.CollectionView.extend({
  className: 'videos',
  tagName() {
    return this.options.viewType === 'thumbnail' ? 'ul' : 'tbody'
  },
  childViewOptions(model) {
    model.set({viewType: this.options.viewType})
  },
  childView: VideoView,
  events: {},
  initialize({video}) {
    this.collection = new Bb.Collection(video)
  }
})
