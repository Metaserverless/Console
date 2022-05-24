export default {
  getTrees2() {
    return {
      server: [{
          id: 'flow',
          type: 'folder',
          system: true,
          text: 'flow',
          children: [{
            id: 'Store.md',
            kind: 'flow',
            text: 'Store.md',
            type: 'flow',
          }, ],
        },
        {
          id: 'schemas',
          type: 'folder',
          system: true,
          text: 'schemas',
          children: [{
              id: 'Account.js',
              kind: 'schema',
              text: 'Account.js',
              type: 'js',
            },
            {
              id: 'Availability.js',
              kind: 'schema',
              text: 'Availability.js',
              type: 'js',
            },
            {
              id: 'Balance.js',
              kind: 'schema',
              text: 'Balance.js',
              type: 'js',
            },
            {
              id: 'Carrier.js',
              kind: 'schema',
              text: 'Carrier.js',
              type: 'js',
            },
            {
              id: 'Order.js',
              kind: 'schema',
              text: 'Order.js',
              type: 'js',
            },
            {
              id: 'OrderForm.js',
              kind: 'schema',
              text: 'OrderForm.js',
              type: 'js',
            },
            {
              id: 'Package.js',
              kind: 'schema',
              text: 'Package.js',
              type: 'js',
            },
            {
              id: 'Payment.js',
              kind: 'schema',
              text: 'Payment.js',
              type: 'js',
            },
            {
              id: 'PaymentForm.js',
              kind: 'schema',
              text: 'PaymentForm.js',
              type: 'js',
            },
            {
              id: 'Product.js',
              kind: 'schema',
              text: 'Product.js',
              type: 'js',
            },
            {
              id: 'Refund.js',
              kind: 'schema',
              text: 'Refund.js',
              type: 'js',
            },
            {
              id: 'Reservation.js',
              kind: 'schema',
              text: 'Reservation.js',
              type: 'js',
            },
            {
              id: 'Return.js',
              kind: 'schema',
              text: 'Return.js',
              type: 'js',
            },
            {
              id: 'Session.js',
              kind: 'schema',
              text: 'Session.js',
              type: 'js',
            },
            {
              id: 'Shipment.js',
              kind: 'schema',
              text: 'Shipment.js',
              type: 'js',
            },
          ],
        },
        {
          id: 'rpcs',
          type: 'folder',
          system: true,
          text: 'RPCs',
          children: [{
            id: 'rpc1.js',
            kind: 'rpc',
            text: 'rpc1.js',
            type: 'js',
          }, ],
        },
        {
          id: 'config',
          type: 'folder',
          system: true,
          text: 'Config',
          children: [{
            id: 'config.json',
            kind: 'config',
            text: 'config.json',
            type: 'json',
          }, ],
        },
        {
          id: 'сontent',
          type: 'folder',
          system: true,
          text: 'Content',
          children: [{
            id: 'test.md',
            kind: 'content',
            text: 'test.md',
            type: 'md',
          }, ],
        },
      ],
      client: [{
          id: 'public',
          type: 'folder',
          system: true,
          text: 'Public',
          children: [{
              id: 'public_js',
              type: 'folder',
              system: true,
              text: 'js',
              children: [{
                id: 'index.js',
                kind: 'js',
                text: 'index.js',
                type: 'js',
              }, ],
            },
            {
              id: 'public_css',
              type: 'folder',
              system: true,
              text: 'css',
              children: [{
                id: 'index.css',
                kind: 'css',
                system: true,
                text: 'index.css',
                type: 'css',
              }, ],
            },
            {
              id: 'public_images',
              type: 'folder',
              system: true,
              text: 'images',
              children: [{
                id: 'test.jpg',
                kind: 'image',
                type: 'image',
                text: 'test.jpg',
              }, ],
            },
            {
              id: 'index.html',
              kind: 'html',
              system: true,
              type: 'html',
              text: 'index.html',
            },
          ],
        },

        {
          id: 'components',
          type: 'folder',
          system: true,
          text: 'Components',
          children: [{
              id: 'header1.html',
              kind: 'component',
              type: 'html',
              text: 'header1.html',
            },
            {
              id: 'footer1.html',
              kind: 'component',
              type: 'html',
              text: 'footer1.html',
            },
          ],
        },
        {
          id: 'elements',
          type: 'folder',
          system: true,
          text: 'Elements',
          children: [{
            id: 'element1.html',
            kind: 'element',
            type: 'html',
            text: 'element1.html',
          }, ],
        },

        {
          id: 'router',
          type: 'folder',
          system: true,
          text: 'Router',
          children: [{
            id: 'router.js',
            system: true,
            kind: 'js',
            type: 'js',
            text: 'router.js',
          }, ],
        },

        {
          id: 'store',
          type: 'folder',
          system: true,
          text: 'Store',

          children: [{
            id: 'store.js',
            kind: 'js',
            system: true,
            type: 'js',
            text: 'store.js',
          }, ],
        },
        {
          id: 'views',
          type: 'folder',
          system: true,
          text: 'Views',

          children: [{
              id: 'MainView.html',
              kind: 'view',
              type: 'html',
              text: 'MainView.html',
            },
            {
              id: 'FirstView.html',
              kind: 'view',
              type: 'html',
              text: 'FirstView.html',
            },
            {
              id: 'SecondView.html',
              kind: 'view',
              type: 'html',
              text: 'SecondView.html',
            },
          ],
        },
      ],
      database: [],
      external: [],
      files: [],
      mail: [],
      versioning: [],
      debugging: [],
      templates: [],
    };
  },

  // getFile(data) {
  //   const files = {

  //     'schemas': {
  //       'Account.js': ``,
  //       'Availability.js': ``,
  //       'Balance.js': ``,
  //       'Carrier.js': ``,
  //       'Order.js': ``,
  //       'OrderForm.js': ``,
  //       'Package.js': ``,
  //       'Payment.js': ``,
  //       'PaymentForm.js': ``,
  //       'Product.js': ``,
  //       'Refund.js': ``,
  //       'Reservation.js': ``,
  //       'Return.js': ``,
  //       'Session.js': ``,
  //       'Shipment.js': ``
  //     }
  //   };
  //   if (!files[data.folder][data.name]) return {
  //     data: '',
  //     error: 'File not found'
  //   };
  //   return {
  //     data: files[data.folder][data.name],
  //     success: 1
  //   };
  // }
};
