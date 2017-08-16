import {
  _,
  $,
  API,
  Bb,
  Mn,
  Pager,
  PagerView,
  I18N,
  SPECIAL_CHAR_REG,
  artDialog,
  stores,
  mapState,
  showTips
} from '../common'

import template from './photo-view.html'

import PhotoPreviewView from './PhotoPreviewView'
import citedDetailsTemp from './cited-details.html'
import emptyView from './photo-empty-view.html'

const Photo = Bb.Model.extend({
  idAttribute: 'mediumId',
  defaults: {
    checked: false,
    editing: false
  }
})

const MAX_INPUT_LENGTH = 50

const PhotoView = Mn.View.extend({
  className: 'photo',
  tagName() {
    return stores.photo.get('viewType') === 'thumbnail' ? 'li' : 'tr'
  },
  template,
  modelEvents: {
    change: 'render'
  },
  events: {
    'click .input-checkbox input'() {
      const photo = this.model
      const checked = !photo.get('checked')
      photo.set({checked}, {silent: true})

      const container = stores.photo

      const media = container.get('media')
      media[photo.collection.indexOf(photo)].checked = checked
      this.$('.photo-item')[checked ? 'addClass' : 'removeClass']('checked')

      let photosNum = 0
      let checkedNum = 0
      _.each(media, medium => {
        if (medium.group) return
        photosNum++
        if (medium.checked) {
          checkedNum++
        }
      })

      container.set({allChecked: photosNum === checkedNum}, {silent: true})
      container.set({checkedNum})
    },
    'click .rename'() {
      this.model.set({editing: true})
    },
    'click .delete'() {
      const medium = this.model

      if (medium.get('group')) {
        this.confirmDeleteGroup()
      } else {
        this.confirmDeletePhoto()
      }
    },
    'compositionstart .input-text'() {
      this.composing = true
    },
    'compositionend .input-text'(e) {
      this.composing = false
      this.inputSearch(e)
    },
    'input .input-text, propertychange .input-text': 'inputSearch',
    'blur .input-text'(e) {
      const medium = this.model
      const mediumId = medium.get('mediumId')
      const group = medium.get('group')
      const $input = $(e.currentTarget)
      let mediumName = $.trim($input.val())

      if (SPECIAL_CHAR_REG.test(mediumName)) {
        showTips(I18N.characterNotSupported)
        return $input.focus()
      }

      const container = stores.photo

      const originMediumName = medium.get('mediumName')

      if (!mediumName) {
        if (mediumId) {
          this[group ? 'showGroupTips' : 'showPhotoTips']()
          return medium.set({editing: false})
        } else {
          return $input.val(originMediumName).select()
        }
      }

      if (group) {
        const currIndex = medium.collection.indexOf(medium)
        const media = stores.photo.get('media')
        const otherGroupNames = media.reduce((prev, medium, index) => {
          if (index !== currIndex && medium.group) {
            prev.push(medium.mediumName)
          }
          return prev
        }, [])

        if (otherGroupNames.indexOf(mediumName) !== -1) {
          this.showGroupTips(mediumName)
          medium.set({groupName: originMediumName, editing: !mediumId}, {silent: true})
          return this.render()
        }

        API.updateGroup({
          groupId: mediumId,
          groupName: mediumName,
          parentGroupId: container.get('currGroupId') || container.get('groupId')
        }).done(({code, data: {groupId, updateTime}}) => {
          if (code) {
            this.showGroupTips(mediumName)
            mediumName = originMediumName
          }

          const attrs = {
            mediumName,
            mediumId: groupId,
            updateTime,
            editing: !mediumId
          }

          medium.set(attrs)
          _.extend(media[currIndex], attrs)
        })
      } else {
        API.renamePhoto({
          mediumId,
          mediumName
        }).done(() => {
          medium.set({mediumName, editing: false})
        })
      }
    },
    'click .J-click-photo'() {
      const container = stores.photo
      const photo = this.model
      if (photo.get('group')) {
        container.set({childGroupId: photo.get('mediumId')})
        return
      }
      const photos = container.get('media').filter(({group}) => !group)
      const currIndex = _.findIndex(photos, ({mediumId}) => mediumId === photo.get('mediumId'))

      const previewView = new PhotoPreviewView({
        photos,
        currIndex
      })

      const dialog = artDialog({
        lock: true,
        title: false,
        cancel: false,
        content: previewView.render().el
      })

      previewView.on('closeDialog', () => {
        dialog.close()
      })
    },
    'click .J-cited-detail'() {
      API.getCitedDetails({
        type: 'photo',
        mediumId: this.model.get('mediumId')
      }).done(({data: citedDetails}) => {
        artDialog.tip(citedDetailsTemp({citedDetails}), '查看被引用')
      })
    }
  },
  confirmDeletePhoto() {
    const medium = this.model
    const mediumId = medium.get('mediumId')

    artDialog.confirm(
      I18N.confirmDeletePhoto,
      {
        fn: () => {
          API.deletePhoto(mediumId).done(({code}) => {
            if (code) {
              showTips('删除失败')
            }
            stores.photo.trigger('fetchPhotos')
          })
        },
        text: I18N.confirm
      },
      {
        text: I18N.cancel
      }
    )
  },
  confirmDeleteGroup() {
    const group = this.model
    artDialog.confirm(
      I18N.confirmDeleteGroup,
      {
        fn: () => {
          API.deleteGroup({groupId: group.get('mediumId'), deleteType: 1}).done(() =>
            stores.photo.trigger('fetchPhotos')
          )
        },
        text: I18N.confirm
      },
      {
        text: I18N.cancel
      }
    )
  },
  showGroupTips(groupName) {
    showTips(groupName ? I18N.duplicateGroupName : I18N.emptyName)
  },
  showPhotoTips() {
    showTips(I18N.emptyName)
  },
  inputSearch(e) {
    if (this.composing) return
    const $input = $(e.currentTarget)
    let inputting = $.trim($input.val())
    if (inputting.length > MAX_INPUT_LENGTH) {
      $input.val((inputting = inputting.substr(0, MAX_INPUT_LENGTH)))
    }
    if (SPECIAL_CHAR_REG.test(inputting)) {
      showTips(I18N.characterNotSupported)
    }
  },
  initialize() {
    const container = stores.photo
    const photo = this.model
    photo.set({viewType: container.get('viewType')})
    this.listenTo(container, 'change:allChecked', (container, allChecked) => {
      if (photo.get('group')) return
      photo.set({checked: allChecked}, {silent: true})
      this.$('.photo-item')[allChecked ? 'addClass' : 'removeClass']('checked')
      this.$('.input-checkbox input').prop('checked', allChecked)
    })
  },
  onRender() {
    this.model.get('editing') && setTimeout(() => this.$('.input-text').select())
  }
})

const Photos = Bb.Collection.extend({
  model: Photo
})

const EmptyView = Mn.View.extend({
  className: 'empty-photos',
  tagName() {
    return stores.photo.get('viewType') === 'thumbnail' ? 'div' : 'tr'
  },
  template: emptyView,
  initialize() {
    mapState(this, stores.photo, ['viewType'])
  }
})

const PhotosView = Mn.CollectionView.extend({
  className() {
    return `photos ${stores.photo.get('viewType')}`
  },
  tagName() {
    return stores.photo.get('viewType') === 'thumbnail' ? 'ul' : 'tbody'
  },
  childView: PhotoView,
  emptyView: EmptyView,
  initialize() {
    const {photo} = stores
    this.collection = new Photos(photo.get('media'))
    this.listenTo(photo, 'change:media', () => this.collection.reset(photo.get('media')))
  }
})

export default Mn.View.extend({
  className() {
    return `photos-wrapper obelisk-form ${stores.photo.get('viewType')}`
  },
  getTemplate() {
    return stores.photo.get('viewType') === 'thumbnail'
      ? `<div class="photos-region"></div>
<div class="pager-region"></div>`
      : `<table class="photos-table">
    <thead>
    <tr>
        <td class="photo-info">
            <div class="input-checkbox">
                <label class="input-wrap">
                    <input type="checkbox" <%- allChecked ? 'checked' : '' %>>
                    <span class="input-ctnr"></span><%- I18N.selectAll %>
                </label>
            </div>
            <%- I18N.name %>
        </td>
        <td class="photo-size"><%- I18N.size %></td>
        <td class="photo-pixel"><%- I18N.pixel %></td>
        <td class="photo-poster"><%- I18N.poster %></td>
        <td class="photo-status"><%- I18N.reviewStatus %></td>
        <td class="photo-update-time"><%- I18N.updatedDate %></td>
        <td class="photo-cited-times"><%- I18N.citedTimes %></td>
        <td class="photo-operation"><%- I18N.operation %></td>
    </tr>
    </thead>
    <tbody>
    </tbody>
</table>
<div class="pager-region"></div>`
  },
  regions: {
    tbody: {
      el: 'tbody',
      replaceElement: true
    },
    photos: '.photos-region',
    pager: '.pager-region'
  },
  childViewEvents: {
    togglePage(currPage) {
      stores.photo.set({currPage})
    }
  },
  events: {
    'click thead .input-checkbox input'() {
      const {photo} = stores
      const allChecked = !photo.get('allChecked')
      let checkedNum = 0

      _.each(photo.get('media'), medium => {
        if (medium.group) return
        medium.checked = allChecked
        allChecked && checkedNum++
      })

      photo.set({allChecked, checkedNum})
    }
  },
  initialize() {
    mapState(this, stores.photo, ['allChecked'])

    this.listenTo(stores.photo, 'change:viewType', (photo, viewType) => {
      this.$el.removeClass('thumbnail list').addClass(viewType)
      this.render()
    })
  },
  onRender() {
    const {photo} = stores

    this.showChildView(photo.get('viewType') === 'thumbnail' ? 'photos' : 'tbody', new PhotosView())

    const pager = new Pager(this.getPager())
    this.showChildView('pager', (this.pagerView = new PagerView({model: pager})))
    this.listenTo(photo, 'change:currPage change:totalPage', () => pager.set(this.getPager()))
    this.listenTo(photo, 'change:checkedNum', () => {
      this.$('thead .input-checkbox input').prop('checked', photo.get('allChecked'))
    })
  },
  getPager() {
    const {photo} = stores
    return {
      currPage: photo.get('currPage'),
      totalPage: photo.get('totalPage')
    }
  }
})
