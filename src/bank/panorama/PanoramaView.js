import {Bb, Mn} from '../common'

import template from './panorama-view.html'

const PanoramaView = Mn.View.extend({
  className: 'panorama',
  tagName() {
    return this.model.attributes.viewType === 'thumbnail' ? 'li' : 'tr'
  },
  template
})

export default Mn.CollectionView.extend({
  className: 'panoramas',
  tagName() {
    return this.options.viewType === 'thumbnail' ? 'ul' : 'tbody'
  },
  childView: PanoramaView,
  childViewOptions(model) {
    model.set({viewType: this.options.viewType})
  },
  initialize({panorama}) {
    this.collection = new Bb.Collection(panorama)
  }
})
