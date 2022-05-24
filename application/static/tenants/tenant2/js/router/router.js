const routes = [{
  name: 'Main',
  path: '/',
  component: 'MainView.html',
  children: [{
      name: 'First',
      path: '/',
      component: 'subviews/FirstView.html',
    },
    {
      name: 'Second',
      path: '/second',
      component: 'subviews/SecondView.html',
    }
  ]
}, ];
export default routes;
