
import OrdersPage from '../pages/orders-list.jsx';
import OrderDetailsPage from '../pages/order-details.jsx';
import AboutPage from '../pages/about.jsx';
import FormPage from '../pages/form.jsx';
import SettingsPage from '../pages/settings.jsx';
import AccountPage from '../pages/account.jsx';

import NotFoundPage from '../pages/404.jsx';

var routes = [
  
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/orders',
    component: OrdersPage,
    ignoreCache:true,
  },
  // {
  //   path: 'order/:id/',
  //   component: OrderDetailsPage,
  // },
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
      resolve(
        {
          component: OrderDetailsPage,
        },
        {
          context: {
            orderId: id,
          }
        }
      );
      app.preloader.hide();
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
    path: '/account/',
    component: AccountPage,
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
