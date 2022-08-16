import events from './events.js';

const keyboard = {

  codes: [
    // {
    //   ctrlKey: true,
    //   shiftKey: true,
    //   keyCode: 78,
    //   // key: 'N',
    //   event: 'Ctrl+Shift+N'
    // },
    // {
    //   ctrlKey: true,
    //   keyCode: 78,
    //   // key: 'n',
    //   event: 'Ctrl+n'
    // },
    {
      ctrlKey: true,
      keyCode: 76,
      // key: 'l',
      event: 'Ctrl+l'
    },
     {
      ctrlKey: true,
      shiftKey: true,
      keyCode: 69,
      // key: 'N',
      event: 'Ctrl+Shift+E',
    },
    {
      ctrlKey: true,
      keyCode: 69,
      // key: 'n',
      event: 'Ctrl+e',
    },
    {
      ctrlKey: true,
      keyCode: 89,
      // key: 't',
      event: 'Ctrl+y',
    },
    {
      ctrlKey: true,
      shiftKey: true,
      keyCode: 83,
      // key: 'S',
      event: 'Ctrl+Shift+S'
    }, {
      ctrlKey: true,
      keyCode: 83,
      // key: 's',
      event: 'Ctrl+s'
    }
  ],

  init() {
    window.addEventListener('keydown', this.keyDown.bind(this));
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
