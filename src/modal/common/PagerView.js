import {$, _, Bb, Mn} from './basic'

export const Pager = Bb.Model.extend({
  defaults: {
    currPage: 1,
    totalPage: 1,
    pages: []
  }
})

const generateArr = (length, offset = 0) => _.toArray({length}).map((val, index) => offset + index + 1)

export default Mn.View.extend({
  className: 'pager',
  template: `<span class="page" data-page="<%- currPage - 1 %>" <%- currPage === 1 ? 'disabled' : '' %> ><i
    class="ob-icon icon-left"/></span>
<% _.each(pages, function(page) { %>
  <% if(page == null) { %>
  <span class="dot"><i class="ob-icon icon-more"></i></span>
  <% } else if(page == currPage) { %>
  <span class="current"><%- page %></span>
  <% } else { %>
  <span class="page" data-page="<%- page %>"><%- page %></span>
  <% } %>
<% }) %>
<span class="page page-main" data-page="<%- currPage + 1 %>" <%- currPage === totalPage ? 'disabled' : '' %> >
    <%- I18N.nextPage %>
    <i class="ob-icon icon-right"></i>
</span>`,
  initialize(options) {
    this.model = options.model || new Pager(options.pager)
    this.resetPages()
  },
  modelEvents: {
    'change:currPage change:totalPage': 'resetPages',
    'change:pages': 'render'
  },
  events: {
    'click .page'(e) {
      const currPage = $(e.currentTarget).data('page')
      if (!currPage) return
      this.trigger('togglePage', currPage)
    }
  },
  resetPages() {
    const pager = this.model
    const currPage = pager.get('currPage')
    const totalPage = pager.get('totalPage')
    let pages
    if (totalPage <= 11) {
      pages = generateArr(totalPage)
    } else {
      if (currPage > 6) {
        pages = [1, null, currPage - 3, currPage - 2, currPage - 1, currPage]
      } else {
        pages = generateArr(currPage)
      }
      if (totalPage - currPage > 5) {
        pages.push(currPage + 1, currPage + 2, currPage + 3, null, totalPage)
      } else if (totalPage > currPage) {
        pages.push.apply(pages, generateArr(totalPage - currPage, currPage))
      }
    }
    pager.set({pages})
  }
})
