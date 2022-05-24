class controllerTerminal {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    this.elements = {
      terminal: document.getElementById(id),
    };
    modules.events.listen('new:terminal', this.newTerminal.bind(this));
  }
  newTerminal() {
    // console.log('new terminal');
    this.elements.terminal.classList.toggle('display-none');
  }
}

export default controllerTerminal;
