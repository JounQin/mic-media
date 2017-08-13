import {$, Bb, Mn, API, I18N, PagerView} from '../common'

import PhotosView from './PhotosView'
import template from './photo-container.html'

const TABS = [
  {
    type: 'custom',
    text: I18N.customPhotos
  },
  {
    type: 'system',
    text: I18N.systemPhotos
  },
  {
    type: 'cameraman',
    text: I18N.cameramanPhotos
  }
]

const VIEW_TYPES = ['thumbnail', 'list']

export default Mn.View.extend({
  className: 'main photo-container',
  template,
  model: new Bb.Model({
    viewType: 'thumbnail',
    currPage: '1',
    totalPage: '1'
  }),
  regions: {
    search: '.search-region',
    tabs: '.tabs-region',
    photo: '.photo-region',
    pager: '.pager-region'
  },
  events: {
    'click .J-toggle-list-type .ob-icon'(e) {
      const viewType = VIEW_TYPES[$(e.currentTarget).index()]
      console.log(viewType)

      // stores.photo.set({viewType})
      API.switchViewType(viewType)
    }
  },
  initialize() {
    this.getFullData()
  },
  getFullData: (function() {
    let timeout

    return function() {
      clearTimeout(timeout)

      const container = this.model

      timeout = setTimeout(() =>
        API.getPhotos({
          groupId: container.get('childGroupId') || container.get('groupId'),
          ...container.pick([
            'sourceType',
            'keyword',
            'posterId',
            'mediumStatus',
            'cited',
            'currPage',
            'sortType',
            'reverse'
          ])
        }).done(({data}) => {
          console.log(data)
          const {totalStorage, usedStorage, groups, posters, media, pager, viewType} = data
          container.set({
            totalStorage,
            usedStorage,
            tabs: TABS.map(tab => {
              const {type} = tab
              return {
                ...tab,
                remark: data[`${type}PhotosNum`],
                highlight: type === 'cameraman' && data.cameramanNewPhoto
              }
            }).filter(tab => tab.remark !== 0),
            groups,
            posters,
            media,
            viewType,
            ...pager,
            currPage: Math.min(container.get('currPage'), pager.totalPage),
            allChecked: false,
            checkedNum: 0
          })
        })
      )
    }
  })(),
  onRender() {
    const container = this.model
    window.Select.use(this.$('select'))
    this.showChildView('photo', new PhotosView())
    this.showChildView(
      'pager',
      new PagerView({
        pager: {currPage: container.get('currPage'), totalPage: container.get('totalPage')}
      })
    )
  }
})
