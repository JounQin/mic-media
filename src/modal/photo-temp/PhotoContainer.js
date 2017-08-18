import {$, Bb, Mn, API, I18N, Pager, PagerView, showTips} from '../common'

import FilterView from './FilterView'
import PhotosView from './PhotosView'

import template from './photo-container.html'
import SortTypesView from './ActionsView'

export default Mn.View.extend({
  className: 'main photo-container',
  template,
  model: new Bb.Model({
    viewType: 'thumbnail',
    currPage: 1,
    totalPage: 1,
    keyword: null,
    sortType: null,
    reverse: false,
    groupType: '0',
    groupList: null,
    posters: null,
    posterId: null,
    groupId: null,
    groupName: null,
    childGroups: null
  }),
  regions: {
    filter: '.filter-region',
    actions: '.actions-region',
    photos: '.photos-region',
    tbody: {
      el: 'tbody',
      replaceElement: true
    },
    pager: '.pager-region'
  },
  modelEvents: {
    'change:currPage change:keyword change:sortType change:reverse change:groupType'() {
      this.getFullData()
    }
  },
  childViewEvents: {
    search(keyword) {
      this.model.set({keyword})
    },
    togglePage(currPage) {
      this.model.set({currPage})
    }
  },
  events: {
    'click .J-confirm'() {
      if ($('input[type="checkbox"]:checked').length === 0) {
        showTips(I18N.photoTips)
      }
    }
  },
  initialize() {
    this.getFullData()
  },
  getFullData() {
    const photo = this.model
    const currPage = photo.get('currPage')
    API.getPhotos({
      currPage,
      ...photo.pick(['keyword', 'sortType', 'reverse', 'groupType'])
    }).done(({data}) => {
      const {media, pager, viewType, posters, childGroups} = data
      photo.set({
        currPage: Math.min(currPage, pager.totalPage),
        media,
        posters,
        ...pager,
        viewType,
        childGroups
      })
    })
  },
  onRender() {
    const container = this.model

    this.showChildView('filter', new FilterView({container}))
    this.showChildView('actions', new SortTypesView({container}))
    this.showChildView('photos', new PhotosView({container}))

    const pager = new Pager(container.pick(['currPage', 'totalPage']))
    this.showChildView('pager', new PagerView({model: pager}))
    this.listenTo(container, 'change:currPage change:totalPage', () =>
      pager.set(container.pick(['currPage', 'totalPage']))
    )
  }
})
