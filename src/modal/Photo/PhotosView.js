import {$, Bb, Mn, I18N, mapState, showTitle} from '../common'

import photosView from './photos-view.html'
import template from './photo-view.html'

const PanoramaView = Mn.View.extend({
  className: 'photo',
  tagName() {
    return this.model.get('viewType') === 'thumbnail' ? 'li' : 'tr'
  },
  template
})

const PhotosView = Mn.CollectionView.extend({
  className: 'photos',
  tagName() {
    return this.options.container.get('viewType') === 'thumbnail' ? 'ul' : 'tbody'
  },
  childView: PanoramaView,
  childViewOptions(model) {
    model.set({viewType: this.options.container.get('viewType')})
  },
  events: {
    'mousemove .J-enlarge'(e) {
      showTitle(e, I18N.photoPreview)
    },
    'mouseout .J-enlarge'() {
      $('.alert-title').hide()
    },
    'mousemove .J-image-title'(e) {
      const media = this.options.container.get('media')
      const id = $(e.currentTarget).attr('data-index')
      let size = ''
      let date = ''
      media.map(el => {
        $.each(el, (key, value) => {
          if (key === 'mediumId' && value === id) {
            size = el.mediumSize
            date = el.updateTime
          }
        })
      })
      showTitle(
        e,
        `<ul>
           <li>${I18N.size}: ${size}</li>
           <li>${I18N.updatedDate}: ${date}</li>
       </ul>`
      )
    },
    'mouseout .J-image-title'() {
      $('.alert-title').hide()
    },
    'click .input-checkbox input'() {
      $('.photo-item').removeClass('checked')
      $('input[type="checkbox"]:checked').parents('.photo-item').addClass('checked')
    }
  },
  initialize({container}) {
    this.collection = new Bb.Collection(container.get('media'))
    this.listenTo(container, 'change:media', (container, media) => this.collection.reset(media))
  }
})

export default Mn.View.extend({
  className: 'photo-wrap obelisk-form',
  template: photosView,
  regions: {
    list: {
      el: '.list-region',
      replaceElement: true
    }
  },
  modelEvents: {
    change: 'render'
  },
  initialize({container}) {
    mapState(this, container, ['viewType'])
  },
  onRender() {
    this.showChildView('list', new PhotosView({container: this.options.container}))
  }
})
