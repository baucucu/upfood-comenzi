
import OrdersPage from '../pages/orders-list.jsx';
import OrderDetailsPage from '../pages/order-details.jsx';
import AboutPage from '../pages/about.jsx';
import FormPage from '../pages/form.jsx';
import SettingsPage from '../pages/settings.jsx';

import NotFoundPage from '../pages/404.jsx';

var routes = [
  
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/orders/',
    ptr: true,
    ignoreCache:true,
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

      fetch(`https://app.ecwid.com/api/v3/39042093/orders?token=secret_aSPm45zBRYXfkiribm58TDtgKqdVwEn7`,)
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
    ignoreCache:true,
    async: async function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var id = routeTo.params.id;

       fetch(`https://app.ecwid.com/api/v3/39042093/orders/${id}?token=secret_aSPm45zBRYXfkiribm58TDtgKqdVwEn7`,)
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

  // {
  //   path: '/dynamic-route/blog/:blogId/post/:postId/',
  //   component: DynamicRoutePage,
  // },
  
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
