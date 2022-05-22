/* eslint-disable */

const routes = [
  { name: 'Main', path: '/main', component: 'main-view' },
  { name: 'Javascript', path: '/javascript', component: 'javascript-view' },
  { name: 'Markdown', path: '/markdown', component: 'markdown-view' },
  { name: 'Sql', path: '/sql', component: 'sql-view' },
  { name: 'Json', path: '/json', component: 'json-view' },
  { name: 'Css', path: '/css', component: 'css-view' },
  { name: 'Html', path: '/html', component: 'html-view' },
  { name: 'Diagram', path: '/', component: 'diagram-view' },
  { name: 'Table', path: '/table', component: 'table-view' },
];

const router = {
  routes,
  activeView: null,
  elements: {
    // topMenu: document.getElementById('top-menu'),
    routerView: document.getElementById('router-view'),
    views: {},
  },

  init() {
    //  window.history.pushState({}, '', '/test')
    // this.elements.routerView.style.display = 'none';
    // window.addEventListener('pushstate', event => { console.log(event)});
    window.addEventListener('popstate', (event) => {
      console.log(event);
    });

    const path = window.location.pathname;

    for (let route of this.routes) {
      let element = document.getElementById(route.component);
      if (!element) continue;
      route.element = element;
      if (path === route.path) {
        this.goto(route.path);
        // this.activeView = route;
        // element.style.visibility = 'visible';
        // element.style.transform = 'translateX(0)';
      }

      // route.path = route.path.replace(/\/$/, '');
      // route.path = route.path.replace(/^\//, '');
    }
  },

  goto(path, data = {}) {
    let before = true;
    const previous = this.activeView;
    for (let i = 0; i < routes.length; i++) {
      let route = routes[i];

      if (route.name == path || route.path == path) {
        // this.elements.visualViewport.innerHTML = parser.parse(route.component);
        if (this.activeView) {
          if (this.activeView == route) return false;
          //this.activeView.element.style.transform = 'translateX(100%)';
          this.activeView.element.style.visibility = 'hidden';
        }

        // window.history.pushState(data, '', route.path);
        this.activeView = route;
        this.activeView.element.style.visibility = 'visible';
        // this.activeView.element.style.transform = 'translateX(0)';
      }
    }

    // for (let link of this.elements.topMenu.querySelectorAll('a')) {
    //   link.classList.remove('active');
    //   // console.log(link.getAttribute('data-href'), this.activeView.name)
    //   if (link.getAttribute('data-href') == this.activeView.name) {
    //     link.classList.add('active');
    //   }
    // }
  },

  replace() {
    // window.history.replaceState(state, title, url);
  },
};

export default router;
