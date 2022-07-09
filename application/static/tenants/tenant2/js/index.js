import Router from './router/router.js';
import store from './store/store.js';

class MuiCtrl {
  constructor(id) {
    this.el = document.getElementById(id);
    this.routerView = this.el.querySelector('.router-view');
    if (this.routerView) this.views = {};
  }
  fetchView(url) {
    if (!this.routerView) return;
    fetch(url).then(res => res.text()).then(html => {
      const range = document.createRange();
      range.selectNode(this.app);
      const documentFragment = range.createContextualFragment(html);
      documentFragment.querySelectorAll('data-url').forEach(el => {

      })
      this.routerView.appendChild(documentFragment);
    }).error(e => console.error(e));
  }
  loadView(url) {
    if (!this.routerView) return;
    if (this.views[url]) {
      const documentFragment = document.createDocumentFragment();
      documentFragment.append(...this.views[url]);
      this.routerView.appendChild(documentFragment);
    } else {
      this.fetchView(url);
    }
  }
  unloadView(url) {
    if (!this.routerView) return;
    this.views[url] = Array.from(this.routerView.children);
    this.routerView.replaceChildren();
  }
}

class MUI extends MuiCtrl {

  constructor(id) {
    super(id);
    this.app = document.getElementById('app');
    this.ctrls = {};
    this.router = Router;
    this.store = store;
    store.actions.increment();
  }

  register(ctrl) {
    this.ctrls[ctrl.name] = ctrl;
  }

}

window.addEventListener('load', () => {
  window.mui = new MUI('app');
});
