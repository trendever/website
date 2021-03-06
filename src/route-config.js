/* globals mixpanel */

import InfoRoutes from 'project/info/routes'

export function configRouter(router) {
  router.map({
    'android':{
      name: 'androidhack',
      component: require('base/androidhack/hack.vue')
    },
    'app':{
      name: 'app',
      component: require('project/applink/index.vue')
    },
    '/': {
      name: 'home',
      component: require('project/product-list/index.vue')
    },
    'dressblogger':{
       name: 'dressblogger',
       component: require('project/dressblogger.vue')
     },
    '/product/:id': {
      name: 'product_detail',
      component: require('project/product-detail/index.vue')
    },

    '/product/:id/repost': {
      name: 'product_repost',
      component: require('project/product-detail/repost.vue')
    },

    '/chat': {
      name: 'chat_list',
      component: require('project/chat-list/index.vue'),
    },

    'chat/zoom': {
      name: 'chat_zoom',
      component: require('base/popup-img/routed')

    },

    '/chat/:id': {
      name: 'chat',
      component: require('project/chat/index.vue'),
    },

    '/chat/:id/payed/:result': {
      name: 'chatPayed',
      component: require('project/chat/index.vue'),
    },

    '/settings/tracking': {
      name: 'settings-tracking',
      component: require('project/settings-tracking/index.vue'),
    },

    '/settings/token': {
      name: 'settings-token',
      component: require('project/settings-token/index.vue'),
    },

    '/logout': {
      name: 'logout',
      component: require('project/logout/index.vue'),
    },

    '/signup': {
      name: 'signup',
      component: require('project/auth/signup.vue'),
    },

    '/confirm-sms': {
      name: 'comfirm-sms',
      component: require('project/auth/confirm-sms.vue'),
    },

    '/404': {
      name: '404',
      component: require('project/not-found/index.vue'),
    },

    '/info': {
      name: 'info',
      component: require('project/info/index.vue'),
      subRoutes: InfoRoutes()
    },

    '/contest': {
      name: 'contest',
      component: require('project/contest/index.vue')
    },

    '/video': {
      name: 'main-video',
      component: require('base/main-video/index.vue')
    },

    '/profile': {
      name: 'profile',
      component: require('project/profile/index.vue')
    },
    '/payment': {
      name: 'payment',
      component: require('project/payment/payment.vue')
    },

    '/foreign': {
      name: 'foreign-link',
      component: require('project/app-iframe/index.vue')
    },

    '/monetization': {
      name: 'monetization',
      component: require('project/monetization/index.vue')
    },

    '/pay-on': {
      name: 'pay-on',
      component: require('project/monetization/pay-on.vue')
    },

    '/:id': {
      // !important it must be last of the list.
      // (exlclude '*' not found)
      name: 'user',
      component: require('project/profile/index.vue')
    },

    // not found handler
    '*': {
      component: require('project/not-found/index.vue'),
    },

  });

  router.afterEach(function(transition) {

    // Mixpanel
    var data = {
      toPath: transition.to.path,
      toName: transition.to.name
    };
    if (transition.from) {
      data.fromPath = transition.from.path;
      data.fromName = transition.from.name;
    }
    mixpanel.track('Page: ' + transition.to.name, data);
  });
}
