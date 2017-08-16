import {_, Bb, Mn, API, I18N, stores} from '../common'

import TabsView from './TabsView'
import SideView from './SideView'
import BodyView from './BodyView'

import template from './photo-container.html'

const TABS = [
  {
    type: 'custom',
    text: I18N.customPhotos
  },
  // {
  //   type: 'system',
  //   text: I18N.systemPhotos
  // },
  {
    type: 'cameraman',
    text: I18N.cameramanPhotos
  }
]

const TYPES = TABS.map(({type}) => type)

const DEFAULT_ATTRS = {
  media: [],
  posterId: null,
  mediumStatus: null,
  cited: null,
  sortType: null,
  reverse: false,
  currPage: 1,
  totalPage: 1,
  allChecked: false,
  checkedNum: 0,
  ungroupedId: '-1'
}

const Container = Bb.Model.extend({
  defaults: {
    activeTabIndex: 0,
    sourceType: 'custom',
    groupId: null,
    childGroupId: null,
    keyword: null,
    tabs: TABS,
    totalStorage: 5 * 1024,
    usedStorage: 0,
    childGroups: [],
    groups: [
      {
        groupId: null,
        groupName: I18N.allPhotos
      },
      {
        groupId: '-1',
        groupName: I18N.ungrouped
      }
    ],
    posters: [],
    viewType: 'thumbnail',
    hasPhotographyService: true,
    empty: false,
    searchEmpty: false,
    ...DEFAULT_ATTRS
  }
})

let storedAttributes

export default Mn.View.extend({
  className: 'main photo-container',
  template,
  regions: {
    tabs: '.tabs-region',
    side: '.side-region',
    body: '.body-region'
  },
  modelEvents: {
    'change:searchEmpty': 'render',
    'change:totalPage'(model, totalPage) {
      model.set({empty: totalPage === 0})
    },
    'change:activeTabIndex'(model, activeTabIndex) {
      this.model.set({
        groupId: null,
        childGroupId: null,
        sourceType: TYPES[activeTabIndex],
        ...DEFAULT_ATTRS
      })
      this.getFullData()
    },
    'change:groupId'() {
      this.model.set({
        childGroupId: null,
        ...DEFAULT_ATTRS
      })
      this.getFullData()
    },
    'change:childGroupId'() {
      this.model.set(DEFAULT_ATTRS)
      this.getFullData()
    },
    'change:posterId change:mediumStatus change:cited': 'getFullData',
    fetchPhotos: 'getFullData'
  },
  childViewEvents: {
    fetchPhotos() {
      this.getFullData()
    }
  },
  initialize() {
    this.model = stores.photo = new Container()
    this.getFullData()
  },
  searchPhotos(keyword) {
    const container = this.model
    const lastKeyword = container.get('keyword')

    if (keyword === lastKeyword) return

    if (keyword) {
      if (!lastKeyword) {
        storedAttributes = {...container.attributes}
      }
      container.set({activeTabIndex: -1, keyword})
    } else {
      container.set(storedAttributes)
    }

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
          const {
            totalStorage,
            usedStorage,
            groups,
            childGroups,
            posters,
            media,
            pager,
            viewType,
            hasPhotographyService
          } = data

          const tabs = TABS.map(tab => {
            const {type} = tab
            return {
              ...tab,
              remark: data[`${type}PhotosNum`],
              highlight: type === 'cameraman' && data.cameramanNewPhoto
            }
          })

          if (container.get('activeTabIndex') === -1) {
            const tabIndex = tabs.findIndex(tab => tab.remark > 0)
            return container.set({
              activeTabIndex: tabIndex,
              searchEmpty: tabIndex === -1
            })
          }

          container.set({
            totalStorage,
            usedStorage,
            tabs,
            groups,
            childGroups,
            posters,
            media,
            viewType,
            hasPhotographyService,
            ...pager,
            ungroupedId: _.find(groups, ({ungrouped}) => ungrouped).groupId,
            currPage: Math.min(container.get('currPage'), pager.totalPage),
            allChecked: false,
            checkedNum: 0,
            searchEmpty: false
          })
        })
      )
    }
  })(),
  onRender() {
    if (this.model.get('searchEmpty')) return
    this.showChildView('tabs', new TabsView())
    this.showChildView('side', new SideView())
    this.showChildView('body', new BodyView())
  },
  onDestroy() {
    stores.photo = null
  }
})
