/* eslint-disable */
const events = {
  array: [],
  init() {
    if (window.parent) {
      window.addEventListener('message', this.onMessage.bind(this));
    }
  },

  onMessage(event) {
    const origin = window.location.protocol + '//' + window.location.hostname;
    const dev_origin = origin + ':8080';
    // console.log(event.origin, origin);
    if ((event.origin !== origin && event.origin !== dev_origin) || !event.data.name) return;
    const obj = this.array.find(o => o.name == event.data.name);
    if (obj && obj.fn) obj.fn(event.data.data || {});
  },

  postMessage(name, data = {}) {
    // console.log(window.parent, window === window.top)
    if (window === window.top || !window.parent) return;
    window.parent.postMessage({
      name,
      data
    }, "*");
  },


  emit(name, data = {}) {
    //console.log(name)
    document.dispatchEvent(new CustomEvent(name, {
      detail: data
    }));
    this.postMessage(name, data);
  },

  listen(name, callback) {
    //  this.array.push({name, callback})
    const fn = (e) => callback(e.detail);
    this.array.push({
      name,
      fn
    });
    document.addEventListener(name, fn);
  },

  remove(name, callback) {
    const obj = this.array.find(o => o.name == name && o.fn == callback);
    if (obj) {
      document.removeEventListener(name, obj.fn);
      this.array = this.array.filter(o => o != obj);
    }
  },
};

export default events;
