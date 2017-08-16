import {$, Bb, Mn, I18N, sizeLimit, supportHtml5} from '../common'

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

// error code 1: 非RGB模式, 2: 重复, 3: 超出可用上限, 4: 超出单张限制, 5: 压缩失败, 6:格式错误
const NON_RGB = 1
const REPEAT = 2
const EXCEED_USAGE = 3
const EXCEED_LIMIT = 4
const ZIP = 5
const MIME = 6

export default Mn.View.extend({
  className: 'upload-photo',
  template,
  regions: {
    photos: '.photos'
  },
  onRender() {
    const photos = new Bb.Collection()

    this.showChildView('photos', new PhotosView({collection: photos}))

    const {Upload} = window.FOCUS.widget
    const {MIME_TYPE, QUEUE_ERROR} = Upload
    setTimeout(() => {
      let $errors
      let $progress
      let $uploaded
      let $photos
      let checked = 0
      const repeated = []

      const fileTypes = [MIME_TYPE.JPEG, MIME_TYPE.JPG]

      if (supportHtml5) {
        fileTypes.push(MIME_TYPE.PNG)
      }

      const uploader = new Upload({
        uploadURL: '/api/media/photo/upload',
        sizeLimit,
        queueLimit: 50,
        fileTypes: fileTypes.join(),
        button: {
          text: I18N.selectPhotos
        },
        plugins: 'zip',
        zip: {
          size: '500KB'
        }
      })
        .on('ready', () => {
          $errors = this.$('.errors')
          $progress = this.$('.upload-progress')
          $uploaded = this.$('.uploaded')
          $photos = this.$('.photos')
        })
        .on('dialogComplete', selected => {
          !checked && selected && $progress.addClass('active')
          checked += selected
          continueUpload()
        })
        .on('queueError', (file, code) => {
          checked--

          switch (code) {
            case QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
              showError(EXCEED_LIMIT)
              break
            case QUEUE_ERROR.INVALID_FILETYPE:
              showError(MIME)
              break
          }
        })
        .on('uploadProgress', (file, complete, total) => {
          $uploaded.width(complete * 100 / total + '%')
        })
        .on('uploadSuccess', (file, response) => {
          $photos.addClass('active')
          const {code, data} = $.parseJSON(response)

          if (code) {
            checked--
            showError(code, data)
            return
          }

          photos.push(data)
          this.trigger('uploaded', data)
        })
        .on('uploadComplete', continueUpload)
        .on('zipError', () => {
          checked--
          showError(ZIP)
        })

      function continueUpload() {
        if (checked >= 50) return uploader.turn('off')
        $uploaded.width(0)
        uploader.startUpload()
      }

      /**
       *
       * @param code 1: 非RGB模式, 2: 重复, 3: 超出可用上限, 4: 超出单张限制, 5: 压缩失败, 6:格式错误
       * @param error
       */
      function showError(code, error) {
        $errors.addClass('active')
        $uploaded.width(0)
        switch (+code) {
          case NON_RGB:
            if ($errors.find('.rgb').length) {
              return
            }

            $errors.append(`<div class="rgb">${I18N.nonRgbError}</div>`)
            break
          case REPEAT: {
            const $repeat = $errors.find('.repeat')

            repeated.push(error)

            const html = `${I18N.photoRepeatedError(
              repeated.length
            )}<span class="view-details"><i class="ob-icon icon-down"></i>${I18N.viewDetails}.</span>
<ul class="details">
${repeated
              .map(({mediumName, originMediumName}) => `<li>${I18N.photoRepeatTips(mediumName, originMediumName)}</li>`)
              .join('')}
</ul>`

            if ($repeat.length) {
              $repeat.html(html)
            } else {
              $errors.append(`<div class="repeat">${html}</div>`)
            }

            const $viewDetails = $errors.find('.view-details')

            $viewDetails.on('click', () => {
              const isActive = $viewDetails.toggleClass('active').hasClass('active')
              $viewDetails.html(
                isActive
                  ? `<i class="ob-icon icon-up"></i>${I18N.hideDetails}`
                  : `<i class="ob-icon icon-down"></i>${I18N.viewDetails}`
              )
            })

            break
          }
          case EXCEED_USAGE: {
            const $usage = $errors.find('.exceed-usage')

            const html = I18N.exceedUsageError(error)

            if ($usage.length) {
              $usage.html(html)
            } else {
              $errors.append(`<div class="exceed-usage">${html}</div>`)
            }
            break
          }
          case EXCEED_LIMIT:
            if ($errors.find('.exceed-limit').length) {
              return
            }
            $errors.append(`<div class="exceed-limit">${I18N.sizeLimitError}</div>`)
            break
          case ZIP:
            if ($errors.find('.zip').length) {
              return
            }
            $errors.append(`<div class="zip">${I18N.zipError}</div>`)
            break
          case MIME:
            if ($errors.find('.mime').length) {
              return
            }
            $errors.append(`<div class="mime">${I18N.mimeTypeError}</div>`)
            break
        }
      }
    })
  }
})
