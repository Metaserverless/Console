import {
  Metacom
} from './metacom.js';



class Application {
  constructor() {

    const protocol = location.protocol === 'http:' ? 'ws' : 'wss';
    this.metacom = Metacom.create(`${protocol}://${location.host}/api`);
  }
}

window.addEventListener('load', async () => {
  window.application = new Application();
  window.api = window.application.metacom.api;
  await application.metacom.load('auth', 'console', 'store', 'example');
  const token = localStorage.getItem('metarhia.session.token');
  let accountId = localStorage.getItem('metarhia.session.accountId');
  let logged = false;

  if (token) {
    const res = await api.auth.restore({
      token,
    });
    logged = res.status === 'logged';
  }
  if (!logged) {
    const res = await api.auth.signin({
      login: 'marcus',
      password: 'marcus',
    });
    if (res.token) {
      localStorage.setItem('metarhia.session.token', res.token);
    }
    if (res.accountId) {
      accountId = res.accountId;
      localStorage.setItem('metarhia.session.accountId', accountId);
    }
  }

  // console.log(window.api);

  window.api.console.on('error', (error) => {
    console.log(error);
  });

  window.api.console.on('step', (step) => {
    // console.log(JSON.stringify(step));
  });

  window.api.console.on('notify', (notify) => {
    // console.log(JSON.stringify(notify));
    alert(notify.step);
  });

  window.api.console.on('invoke', (invoke) => {
    // console.log(JSON.stringify(invoke));
  });

  window.dm.initTransport(window.api, accountId);

  // const {
  //   text
  // } = await api.console.content({
  //   name: 'home'
  // });
  // // application.print(text);

});

// if (navigator.serviceWorker) {
//   navigator.serviceWorker.register('worker.js');
// }
