import {$, Bb, Mn, I18N, sizeLimit} from '../common'

import template from './upload-photo-view.html'

const PhotoView = Mn.View.extend({
  tagName: 'li',
  className: 'photo',
  template: `<div class="img-wrapper">
<img src="<%- mediumSrc %>" alt="<%- mediumName %>">
</div>
<div class="photo-name"><%- mediumName %></div>`
})

const PhotosView = Mn.CollectionView.extend({
  tagName: 'ul',
  className: 'photo-list',
  childView: PhotoView
})

export default Mn.View.extend({
  className: 'upload-photo',
  template,
  events: {
    'click .upload-text'(e) {
      $(e.currentTarget).next().click()
    }
  },
  regions: {
    photos: '.photos'
  },
  onRender() {
    const photos = new Bb.Collection()

    this.showChildView('photos', new PhotosView({collection: photos}))

    const {Upload} = window.FOCUS.widget
    setTimeout(() => {
      let $progress
      let $photos
      let checked = 0

      const uploader = new Upload({
        uploadURL: '/api/media/photo/upload',
        sizeLimit: sizeLimit,
        button: {
          text: I18N.selectPhotos
        }
      })
        .on('ready', () => {
          $progress = this.$('.upload-progress')
          $photos = this.$('.photos')
        })
        .on('dialogComplete', adding => {
          checked || $progress.addClass('active')
          checked += adding
          continueUpload()
        })
        .on('uploadProgress', (file, complete, total) => {
          this.$('.uploaded').width(complete * 100 / total + '%')
        })
        .on('uploadSuccess', (file, response) => {
          $photos.addClass('active')
          const {data} = $.parseJSON(response)
          photos.push(data)
        })
        .on('uploadComplete', continueUpload)

      function continueUpload() {
        if (checked >= 50) return
        uploader.startUpload()
      }
    })
  }
})
