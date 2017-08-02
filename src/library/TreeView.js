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
  template: `<% if(treeId) { %>
  <div class="tree-node <%- treeId === container.get('treeId') ? 'active' : '' %>">
    <span class="tree-action"><%- unfolded ? '-' : '+' %></span>
    <span class="tree-name"><%- treeName %></span>
  </div>
  <% } else { %>
  <input class="node-input" value="<%- treeName %>"/>
  <% } %>
  <% if(unfolded && nodes.length) { %>
    <ul></ul>
  <% } %>`,
  regions: {
    tree: {
      el: 'ul',
      replaceElement: true
    }
  },
  childViewEvents: {
    checkNode(node) {
      this.trigger('checkNode', node)
    }
  },
  modelEvents: {
    change: 'render'
  },
  events: {
    'click .tree-action'() {
      const node = this.model
      const unfolded = !node.get('unfolded')
      node.set({unfolded})
      node.origin[node.collection.indexOf(node)].unfolded = unfolded
    },
    'click .tree-name'() {
      this.trigger('checkNode', this.model)
    },
    'blur .node-input'() {
      this.model.set({
        treeId: Date.now()
      })
    }
  },
  onRender() {
    const node = this.model
    const nodes = node.get('nodes')
    setTimeout(() => this.$('.node-input').select())
    if (!node.get('unfolded') || !nodes.length) return
    this.showChildView('tree', new TreeView({container: node.get('container'), tree: nodes}))
  }
})

const Tree = Bb.Collection.extend({
  model: Node
})

const TreeView = Mn.CollectionView.extend({
  className: 'tree',
  tagName: 'ul',
  childView: NodeView,
  childViewOptions(model) {
    model.origin = this.options.tree
    model.set({
      container: this.options.container
    })
  },
  childViewEvents: {
    checkNode(node) {
      this.trigger('checkNode', node)
    }
  },
  initialize({tree}) {
    this.collection = new Tree(tree)
  }
})

export default TreeView
