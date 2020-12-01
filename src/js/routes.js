
import HomePage from '../pages/home.jsx';
import OrdersPage from '../pages/orders-list.jsx';
import OrderDetailsPage from '../pages/order-details.jsx';
import AboutPage from '../pages/about.jsx';
import FormPage from '../pages/form.jsx';
// import CatalogPage from '../pages/catalog.jsx';
import ProductPage from '../pages/product.jsx';
import SettingsPage from '../pages/settings.jsx';

import DynamicRoutePage from '../pages/dynamic-route.jsx';
import RequestAndLoad from '../pages/request-and-load.jsx';
import NotFoundPage from '../pages/404.jsx';

const getOrderById = async(id) => {
  await fetch(`https://app.ecwid.com/api/v3/39042093/orders/${id}?token=secret_aSPm45zBRYXfkiribm58TDtgKqdVwEn7`,)
    .then(response => response.json())
    .then(data => {return data})
    .catch(e => console.log(e))
}

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/orders/',
    // component: OrdersPage,
    async: async function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var id = routeTo.params.id;

      await fetch(`https://app.ecwid.com/api/v3/39042093/orders?token=secret_aSPm45zBRYXfkiribm58TDtgKqdVwEn7`,)
        .then(response => response.json())
        .then(data => {
        
          // Hide Preloader
          app.preloader.hide();
          
          // Resolve route to load page
          resolve(
            {
              component: OrdersPage,
            },
            {
              context: {
                orders: data.items,
              }
            }
          );
        })
        .catch(e => console.log(e))
    },
  },
  {
    path: '/order/:id/',
    // component: OrderDetailsPage,
    async: async function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var id = routeTo.params.id;

      await fetch(`https://app.ecwid.com/api/v3/39042093/orders/${id}?token=secret_aSPm45zBRYXfkiribm58TDtgKqdVwEn7`,)
        .then(response => response.json())
        .then(data => {
        
          // Hide Preloader
          app.preloader.hide();
          
          // Resolve route to load page
          resolve(
            {
              component: OrderDetailsPage,
            },
            {
              context: {
                order: data,
              }
            }
          );
        })
        .catch(e => console.log(e))
    },
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/settings/',
    component: SettingsPage,
  },

  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
