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
      component: require('project/directbot/index.vue')
    },
    '/product/': {
      name: 'product_detail',
      component: require('project/directbot/redirect.vue')
    },
    '/chat': {
      name: 'chat_list',
      component: require('project/directbot/chat-list.vue'),
    },

    '/chat/:id': {
      name: 'chat',
      component: require('project/directbot/chat.vue'),
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
      component: require('project/directbot/signup-directbot.vue'),
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

    '/profile': {
      name: 'profile',
      component: require('project/directbot/profile.vue')
    },
    '/turn-on-bot': {
      name: 'turn-on-bot',
      component: require('project/directbot/turn-on-bot.vue')
    },
    '/monetization': {
      name: 'monetization',
      component: require('project/directbot/monetization.vue')
    },
    '/payment': {
      name: 'payment',
      component: require('project/payment/payment.vue')
    },
    '/foreign': {
      name: 'foreign-link',
      component: require('project/app-iframe/index.vue')
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
