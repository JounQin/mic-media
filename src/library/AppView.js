import {Mn} from './common'

import HeaderView from './HeaderView'
import NeckView from './NeckView'
import BodyView from './BodyView'
import TreeView from './TreeView'

export default Mn.View.extend({
  el: '#app',
  template: `<div class="header-region"></div><div class="neck-region"></div><div class="body-region"></div><div class="tree-region"></div>`,
  regions: {
    header: '.header-region',
    neck: '.neck-region',
    body: '.body-region',
    tree: '.tree-region'
  },
  childViewEvents: {
    loading() {
      this.getChildView('body').loading()
    },
    loaded(materials) {
      this.getChildView('body').loaded(materials)
    }
  },
  onRender() {
    this.showChildView('header', new HeaderView())
    this.showChildView('neck', new NeckView())
    this.showChildView('body', new BodyView())
    this.showChildView('tree', new TreeView({
      tree: [{
        treeId: '1',
        treeName: '1',
        nodes: [{
          treeId: '1-1',
          treeName: '1-1',
          nodes: [{
            treeId: '1-1-1',
            treeName: '1-1-1'
          }, {
            treeId: '1-1-2',
            treeName: '1-1-2'
          }, {
            treeId: '1-1-3',
            treeName: '1-1-3'
          }]
        }, {
          treeId: '1-2',
          treeName: '1-2',
          nodes: [{
            treeId: '1-2-1',
            treeName: '1-2-1'
          }]
        }]
      }, {
        treeId: '2',
        treeName: '2',
        nodes: [{
          treeId: '2-1',
          treeName: '2-1'
        }, {
          treeId: '2-2',
          treeName: '2-2',
          nodes: [{
            treeId: '2-2-1',
            treeName: '2-2-1'
          }, {
            treeId: '2-2-2',
            treeName: '2-2-2'
          }, {
            treeId: '2-2-3',
            treeName: '2-2-3'
          }]
        }]
      }]
    }))

    setTimeout(() => {
      this.getChildView('tree').render()
      console.log('rendered')
    }, 5000)
  }
})
