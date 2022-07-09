/* eslint-disable */

class controllerMain {
  constructor(id, modules) {
    this.modules = modules;
    this.view = 'Main';
    this.elements = {
      loadingBackground: document.getElementById('loading-background')
    };

    this.modules.events.listen('system-is-ready', () => {
      this.elements.loadingBackground.style.opacity = 0;
      setTimeout(() => {
        this.elements.loadingBackground.style.display = 'none'
      }, 500)
    })

  }
}

export default controllerMain;
