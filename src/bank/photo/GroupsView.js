import {$, Bb, Mn, API, I18N, stores, artDialog} from '../common'

import template from './group-view.html'

const Group = Bb.Model.extend({
  idAttribute: 'groupId',
  defaults: {
    mediumNum: 0,
    editing: false,
    isActive: false
  }
})

const Groups = Bb.Collection.extend({
  model: Group
})

const GroupView = Mn.View.extend({
  className: 'group',
  tagName: 'li',
  template,
  modelEvents: {
    change: 'render'
  },
  events: {
    'click .group-item'() {
      const group = this.model
      stores.photo.set({
        groupId: group.get('groupId')
      })
    },
    'click .J-edit-group'(e) {
      e.stopPropagation()
      this.model.set({editing: true})
    },
    'click .J-delete-group'(e) {
      e.stopPropagation()
      const group = this.model
      const mediumNum = group.get('mediumNum')
      if (mediumNum) {
        this.confirmDelete()
      } else {
        this.confirmedDelete()
      }
    },
    'click .input-text'(e) {
      e.stopPropagation()
    },
    'blur .input-text'(e) {
      e.stopPropagation()
      const groupName = $.trim($(e.currentTarget).val())

      const group = this.model
      const groupId = group.get('groupId')

      if (groupId && !groupName) {
        this.showTips()
        return group.set({editing: false})
      }

      API.updateGroup({
        groupId: group.get('groupId'),
        groupName,
        parentGroupId: null
      }).done(({code, data: {groupId, groupName: newGroupName}}) => {
        const groupObj = stores.photo.get('groups')[group.collection.indexOf(group)]
        groupObj.groupId = groupId
        if (code) {
          this.showTips(groupName)
          group.set({groupId, groupName: newGroupName, editing: false})
          groupObj.groupName = newGroupName
        } else {
          group.set({groupId, editing: false})
        }
      })
    }
  },
  confirmDelete() {
    const group = this.model
    const groupName = group.get('groupName')
    const dialog = artDialog.confirm(
      `<div class="obelisk-form">
    <ul class="input-radio">
      <li>
          <label class="input-wrap">
              <input type="radio" name="deleteType" value="0" checked>
              <span class="input-ctnr"></span>将${groupName}分组里的所有图片移动到未分组
          </label>
      </li>
      <li>
          <label class="input-wrap">
              <input type="radio" name="deleteType" value="2">
              <span class="input-ctnr"></span>将${groupName}分组里的所有图片永久删除
          </label>
      </li>
    </ul>
</div>`,
      '删除分组',
      {
        fn: () => {
          this.confirmedDelete($(dialog.DOM.content[0]).find('[name="deleteType"]:checked').val())
        },
        text: I18N.confirm
      },
      {
        fn: null,
        text: I18N.cancel
      },
      {
        drag: false
      }
    )
  },
  confirmedDelete(deleteType) {
    const group = this.model
    const groupId = group.get('groupId')

    API.deleteGroup({groupId, deleteType}).done(({code}) => {
      if (code) {
        return this.confirmDelete()
      }

      const {photo} = stores

      const {collection} = group
      const index = collection.indexOf(group)
      const groups = photo.get('groups')
      groups.splice(index, 1)
      collection.remove(group)

      if (group.get('isActive')) {
        photo.set({groupId: null})
      }
    })
  },
  showTips(groupName) {
    console.log(groupName ? '该组名已经存在，请输入不同的名称。' : '请填写组名。')
  },
  initialize() {
    const group = this.model
    const {photo} = stores

    const groupId = group.get('groupId')

    group.set({
      isActive: groupId === photo.get('groupId'),
      keyword: groupId === null && photo.get('keyword')
    })

    this.listenTo(photo, 'change:groupId', (photo, groupId) => group.set({isActive: group.get('groupId') === groupId}))

    this.listenTo(photo, 'change:keyword', (photo, keyword) => {
      groupId === null && group.set({keyword})
    })
  },
  onRender() {
    const group = this.model
    if (group.get('editing')) {
      setTimeout(() => this.$('.input-text').select())
    }
  }
})

export default Mn.CollectionView.extend({
  className: 'groups',
  tagName: 'ul',
  childView: GroupView,
  initialize() {
    const {photo} = stores
    this.collection = new Groups(photo.get('groups'))
    this.listenTo(photo, 'change:groups', (photo, groups) => {
      this.collection.reset(groups)
    })
  }
})
