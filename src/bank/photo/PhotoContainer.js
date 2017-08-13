import {Bb, Mn, API, I18N, stores} from '../common'

import TabsView from './TabsView'
import SideView from './SideView'
import BodyView from './BodyView'

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
  checkedNum: 0
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
    ...DEFAULT_ATTRS
  }
})

export default Mn.View.extend({
  className: 'main photo-container',
  template: `<div class="tabs-region"></div>
<div class="content">
    <div class="side-region"></div>
    <div class="body-region"></div>
</div>`,
  regions: {
    tabs: '.tabs-region',
    side: '.side-region',
    body: '.body-region'
  },
  modelEvents: {
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
    if (keyword === container.get('keyword')) return
    container.set({keyword})
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
          const {totalStorage, usedStorage, groups, childGroups, posters, media, pager, viewType} = data
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
            }),
            groups,
            childGroups,
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
    this.showChildView('tabs', new TabsView())
    this.showChildView('side', new SideView())
    this.showChildView('body', new BodyView())
  },
  onDestroy() {
    stores.photo = null
  }
})
