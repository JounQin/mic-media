import {$, Bb, Mn} from '../common'

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
  events: {
    'click .J-play'() {
      console.log('aaaaa')
    },
    'click .input-radio input'() {
      $('.video-item').removeClass('checked')
      $('input[type="radio"]:checked').parents('.video-item').addClass('checked')
    }
  },
  initialize({video}) {
    this.collection = new Bb.Collection(video)
  }
})
