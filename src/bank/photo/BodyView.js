import {_, $, Mn, I18N, API, stores, mapState, showTips, artDialog} from '../common'

import {generateGroupName} from './utils'

import template from './body-view.html'
import childGroupsView from './child-groups-view.html'
import operationsView from './operations-view.html'
import actionsView from './actions-view.html'
import filterSortView from './filter-sort-view.html'

import PhotosView from './PhotosView'
import UploadPhotoView from './UploadPhotoView'
import MoveToGroupView from './MoveToGroupView'

const VIEW_TYPES = ['thumbnail', 'list']

const OperationsView = Mn.View.extend({
  className: 'operations cf',
  template: operationsView,
  regions: {
    filterSort: {
      el: '.filter-sort',
      replaceElement: true
    }
  },
  modelEvents: {
    change: 'render'
  },
  events: {
    'click .J-toggle-view-type .ob-icon'(e) {
      const viewType = VIEW_TYPES[$(e.currentTarget).index()]
      stores.photo.set({viewType})
      API.switchViewType(viewType)
    },
    'click .J-toggle-page'(e) {
      const $el = $(e.currentTarget)
      if ($el.prop('disabled')) return
      const nextPage = $el.data('page')
      nextPage && stores.photo.set({currPage: nextPage})
    },
    'click .J-add-subgroup'() {
      const {photo} = stores
      const media = photo.get('media')

      // 如果已经存在正在编辑的子分组时不再添加
      if (_.find(media, ({group, editing}) => group && editing)) {
        return
      }

      const groupNames = media.reduce((prev, medium) => {
        if (medium.group) {
          prev.push(medium.mediumName)
        }
        return prev
      }, [])

      photo.set({
        media: [
          {
            groupId: null,
            group: true,
            editing: true,
            mediumName: generateGroupName(groupNames),
            mediumSize: '0K',
            updateTime: null
          },
          ...media
        ].slice(0, 20)
      })
    },
    'click .J-upload-photo'() {
      const uploadPhotoView = new UploadPhotoView()

      const mediumIds = []

      uploadPhotoView.on('uploaded', ({mediumId}) => mediumIds.push(mediumId))

      const dialog = artDialog.confirm(
        uploadPhotoView.render().el,
        I18N.uploadPhotos,
        {
          fn: () => {
            if (!mediumIds.length) {
              return false
            }

            const {photo} = stores

            API.uploadPhoto({
              mediumIds,
              groupId: photo.get('childGroupId') || photo.get('groupId')
            }).done(() => {
              uploadPhotoView.destroy()
              dialog.close()
            })

            return false
          },
          text: I18N.upload
        },
        {
          fn: () => {
            uploadPhotoView.destroy()
          },
          text: I18N.cancel
        }
      )
    }
  },
  initialize() {
    mapState(this, stores.photo, [
      'usedStorage',
      'totalStorage',
      'currPage',
      'totalPage',
      'viewType',
      'sourceType',
      'groupId',
      'childGroupId',
      'childGroups',
      'ungroupedId'
    ])
  },
  onRender() {
    this.model.get('sourceType') === 'cameraman' && this.showChildView('filterSort', new FilterSortView())
  }
})

const SortTypesView = Mn.View.extend({
  className: 'sort-types',
  tagName: 'ul',
  template: `<% _.each(sortTypes, function(value) { %>
<li class="J-toggle-sort-type" data-type="<%- value.type %>">
    <%- value.text %>
    <div class="sort-type-icon sort-<%- sortType === value.type ? reverse ? 'up' : 'down' : 'default' %>"></div>
</li>
<% }) %>`,
  modelEvents: {
    change: 'render'
  },
  events: {
    'click .J-toggle-sort-type'(e) {
      const {photo} = stores

      let sortType = photo.get('sortType')
      let reverse = photo.get('reverse')
      const activeType = $(e.currentTarget).data('type')

      if (sortType !== activeType) {
        sortType = activeType
        reverse = false
      } else if (reverse) {
        sortType = null
        reverse = false
      } else {
        reverse = true
      }

      photo.set({sortType, reverse})
      this.trigger('toggleSortType')
    }
  },
  initialize() {
    mapState(this, stores.photo, ['sortType', 'reverse'])
    this.model.set({sortTypes: I18N.sortTypes})
  }
})

const FilterSortView = Mn.View.extend({
  className: 'filter-sort',
  template: filterSortView,
  regions: {
    sortTypes: {
      el: '.sort-types',
      replaceElement: true
    }
  },
  childViewEvents: {
    toggleSortType() {
      this.trigger('toggleSortType')
    }
  },
  modelEvents: {
    change: 'render'
  },
  initialize() {
    mapState(this, stores.photo, ['posters', 'posterId', 'mediumStatus', 'cited', 'sourceType'])
    this.model.set({reviewStatuses: I18N.reviewStatuses})
  },
  onRender() {
    setTimeout(() =>
      _.each(window.Select.use(this.$('select')), select => select.on('change', () => this.toggleFilter()))
    )
    this.showChildView('sortTypes', new SortTypesView())
  },
  toggleFilter() {
    let posterId = this.$('[name="posterId"]').val()
    posterId = posterId === '' ? null : posterId

    let mediumStatus = this.$('[name="mediumStatus"]').val()
    mediumStatus = mediumStatus === '' ? null : +mediumStatus

    let cited = this.$('[name="cited"]').val()
    cited = cited === '' ? null : cited === 'yes'

    const attrs = {posterId, mediumStatus, cited}

    this.model.set(attrs, {silent: true})
    stores.photo.set(attrs)
  }
})

const ActionsView = Mn.View.extend({
  className: 'actions obelisk-form',
  template: actionsView,
  modelEvents: {
    'change:viewType change:checkedNum': 'render'
  },
  events: {
    'click .input-checkbox input'() {
      const {photo} = stores
      const allChecked = !photo.get('allChecked')
      let checkedNum = 0

      _.each(photo.get('media'), medium => {
        if (medium.group) return
        medium.checked = allChecked
        allChecked && checkedNum++
      })

      photo.set({allChecked, checkedNum})
    },
    'click .J-move-to'() {
      const mediumIds = this.getCheckedMediumIds()
      if (!mediumIds) return

      const moveToGroupView = new MoveToGroupView()

      let groupId

      const dialog = artDialog.confirm(
        moveToGroupView.render().el,
        I18N.moveTo,
        {
          fn: () => {
            API.movePhoto({
              groupId,
              mediumIds
            }).done(({code}) => {
              let tipsText, tipsType
              switch (code) {
                case 0:
                  tipsText = I18N.operatedSuccessfully
                  tipsType = 'succ'
                  break
                case 10003: // 分组已删除
                  tipsText = I18N.groupDeleted
                  break
                case 10004: // 图片已删除
                  tipsText = I18N.photoDeleted
                  break
              }
              showTips(null, tipsText, tipsType)
              stores.photo.trigger('fetchPhotos')
              moveToGroupView.destroy()
            })
          },
          text: I18N.confirm
        },
        {
          fn: () => {
            moveToGroupView.destroy()
          },
          text: I18N.cancel
        }
      )

      const $confirm = $(dialog.DOM.footer[0]).find('.btn-main')

      $confirm.prop('disabled', true)

      moveToGroupView.on('toggleActive', currGroupId => {
        groupId || $confirm.prop('disabled', false)
        groupId = currGroupId
      })
    },
    'click .J-delete-photos'() {
      const mediumIds = this.getCheckedMediumIds()
      if (!mediumIds) return

      artDialog.confirm(
        I18N.confirmDeletePhoto,
        {
          fn: () => {
            API.deletePhoto(mediumIds).done(({code}) => {
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
    'click .J-download-photos'() {
      const mediumIds = stores.photo.get('media').reduce((prev, curr) => {
        if (!curr.group && curr.checked) {
          prev.push(curr.mediumId)
        }
        return prev
      }, [])

      if (!mediumIds.length) {
        return showTips(I18N.selectPhoto)
      }

      window.open(`/api/media/photo/download?mediumIds=${mediumIds}`)
    }
  },
  getCheckedMediumIds() {
    const mediumIds = stores.photo.get('media').reduce((prev, curr) => {
      if (!curr.group && curr.checked) {
        prev.push(curr.mediumId)
      }
      return prev
    }, [])

    if (mediumIds.length) return mediumIds

    showTips(I18N.selectPhoto)
  },
  initialize() {
    mapState(this, stores.photo, ['viewType', 'allChecked', 'checkedNum', 'sourceType'])
  }
})

const ChildGroupsView = Mn.View.extend({
  className: 'child-groups',
  template: childGroupsView,
  modelEvents: {
    change: 'render'
  },
  events: {
    'click .J-toggle-groupId'(e) {
      const $span = $(e.currentTarget)
      const index = $span.data('index')
      const groupId = $span.data('group-id')
      stores.photo.set(index ? 'childGroupId' : 'groupId', groupId)
    }
  },
  initialize() {
    mapState(this, stores.photo, ['childGroupId', 'childGroups'])
  },
  onRender() {
    const {model} = this
    this.$el[model.get('childGroupId') ? 'addClass' : 'removeClass']('active')
  }
})

const EmptyView = Mn.View.extend({
  className: 'empty',
  template: `<div class="camera"></div>
<div class="empty-tips"><%- hasPhotographyService ? I18N.noCameramanTips : I18N.noCameramanServiceTips %></div>`,
  initialize() {
    mapState(this, stores.photo, ['hasPhotographyService'])
  }
})

export default Mn.View.extend({
  className: 'body',
  template,
  regions: {
    empty: {
      el: '.empty-region',
      replaceElement: true
    },
    childGroups: {
      el: '.child-groups',
      replaceElement: true
    },
    operations: {
      el: '.operations',
      replaceElement: true
    },
    filterSort: {
      el: '.filter-sort.region',
      replaceElement: true
    },
    actions: {
      el: '.actions',
      replaceElement: true
    },
    media: '.media-region'
  },
  childViewEvents: {
    toggleSortType() {
      this.getPhotos()
    }
  },
  getPhotos() {
    this.trigger('fetchPhotos')
  },
  initialize() {
    const {photo} = stores
    this.listenTo(photo, 'change:currPage', this.getPhotos)
    this.listenTo(photo, 'change:sourceType', this.render)
    this.listenTo(photo, 'change:empty', (photo, empty) => {
      if (empty && photo.get('sourceType') === 'cameraman') {
        this.render()
      }
    })
  },
  onRender() {
    const {photo} = stores

    const sourceType = photo.get('sourceType')

    const isCameraman = sourceType === 'cameraman'

    if (isCameraman && photo.get('empty')) {
      this.showChildView('empty', new EmptyView())
      return
    }

    this.showChildView('childGroups', new ChildGroupsView())
    this.showChildView('operations', new OperationsView())

    this.$el.removeClass('custom system cameraman').addClass(sourceType)

    if (isCameraman) {
      this.$('.filter-sort.region').remove()
    } else {
      this.showChildView('filterSort', new FilterSortView())
    }

    this.showChildView('actions', new ActionsView())
    this.showChildView('media', new PhotosView())
  }
})
