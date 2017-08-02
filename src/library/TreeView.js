import {Bb, Mn} from './common'

const Node = Bb.Model.extend({
  defaults: {
    unfolded: false,
    nodes: []
  }
})

const NodeView = Mn.View.extend({
  className: 'node',
  tagName: 'li',
  template: `<div class="tree-name"><%- treeName %></div>
  <% if(unfolded && nodes.length) { %>
    <ul></ul>
  <% } %>`,
  regions: {
    tree: {
      el: 'ul',
      replaceElement: true
    }
  },
  modelEvents: {
    change: 'render'
  },
  events: {
    'click .tree-name'() {
      const node = this.model
      const unfolded = !node.get('unfolded')
      node.set({
        unfolded
      })
      node.origin.unfolded = unfolded
    }
  },
  onRender() {
    const node = this.model
    const nodes = node.get('nodes')
    if (!node.get('unfolded') || !nodes.length) return
    this.showChildView('tree', new TreeView({tree: nodes}))
  }
})

const Tree = Bb.Collection.extend({
  model: Node
})

const TreeView = Mn.CollectionView.extend({
  className: 'tree',
  tagName: 'ul',
  childView: NodeView,
  childViewOptions(model, index) {
    model.origin = this.options.tree[index]
  },
  initialize({tree}) {
    this.collection = new Tree(tree)
  }
})

export default TreeView
