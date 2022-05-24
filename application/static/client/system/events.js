const events = {
  array: [],

  emit(name, data) {
    document.dispatchEvent(new CustomEvent(name, {
      detail: data
    }));
  },

  listen(name, callback) {
    //  this.array.push({name, callback})
    document.addEventListener(name, (e) => callback(e.detail));
  },

  remove(name, callback) {
    // this.array = this.array.filter(e => e.name != name && e.callback != callback);
    document.removeEventListener(name, callback);
  },
};

export default events;
