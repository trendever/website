/* globals mixpanel */

export function configRouter(router) {
  router.map({
    '/': {
      name: 'home',
      component: require('project/product-list/index.vue')
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

    '/chat/:id': {
      name: 'chat',
      component: require('project/chat/index.vue'),
    },

    '/mission': {
      name: 'mission',
      component: require('project/mission/index.vue'),
    },

    '/agreement': {
      name: 'agreement',
      component: require('project/agreement/index.vue'),
    },

    '/info/:type': {
      name: 'info',
      component: require('project/info/info.vue'),
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

    '/shop': {
      name: 'shop',
      component: require('project/shop/index.vue'),
    }

    '/profile': {
      name: 'profile',
      component: require('project/profile/index.vue')
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
