const routes = [{
  name: 'Main',
  path: '/',
  component: 'MainView.html',
  children: [{
      name: 'First',
      path: '/',
      component: 'subviews/FirstView.html',
    },
    {
      name: 'Second',
      path: '/second',
      component: 'subviews/SecondView.html',
    }
  ]
}, ];

class Router {
  constructor() {

    this.routes = routes;
    this.activeView = null;
    this.elements = {
      // topMenu: document.getElementById('top-menu'),
      routerView: document.getElementById('router-view'),
      views: {},
    };
  }
}
export default new Router();
