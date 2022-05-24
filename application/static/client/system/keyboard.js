import events from './events.js';

const keyboard = {

  codes: [{
    ctrlKey: true,
    shiftKey: true,
    key: 'S',
    event: 'Ctrl+Shift+S'
  }, {
    ctrlKey: true,
    key: 's',
    event: 'Ctrl+s'
  }],

  init() {
    document.addEventListener('keydown', this.keyDown.bind(this));
  },

  keyDown(e) {

    // console.log(e);
    let event;

    for (let code of this.codes) {
      event = code.event;
      for (let id in code) {
        if (id == 'event') continue;
        if (e[id] !== code[id]) {
          // console.log(id);
          event = false;
          break;
        }
      }
      if (event) break;
    }



    if (event) {
      e.preventDefault();
      e.stopPropagation();
      console.log(event);
      events.emit(event);
    }


    // if (e.keyCode === 27) {
    //   this.modules.dialogs.close();
    // }
  }


};

export default keyboard;
