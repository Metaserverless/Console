const store = (() => {

  const data = {
    counter: 0
  };
  const actions = {
    increment() {
      data.counter++;
      console.log(data.counter);
    }
  };

  // for (let id in actions) {
  //   actions[id] = actions[id].bind(this);
  // }

  return {
    data,
    actions
  }

})();



export default store;
