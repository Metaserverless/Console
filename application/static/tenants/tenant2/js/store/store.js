const store = {
  data: {
    counter: 0
  },
  actions: {
    increment() {
      this.data.counter++;
    }
  }
};
export default store;
