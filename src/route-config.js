/* globals mixpanel */
import store from 'vuex/store'

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
      auth: true,
      component: require('project/chat-list/index.vue'),
    },

    '/chat/:id': {
      name: 'chat',
      auth: true,
      component: require('project/chat/index.vue'),
    },

    '/why': {
      name: 'why',
      component: require('project/why/index.vue'),
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
      auth: true,
      component: require('project/settings-token/index.vue'),
    },

    '/logout': {
      name: 'logout',
      auth: true,
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

    // not found handler
    '*': {
      component: require('project/not-found/index.vue'),
    },

    '/404': {
      name: '404',
      component: require('project/not-found/index.vue'),
    }

  });

  router.beforeEach(function(transition) {
    if (transition.to.auth && !store.state.user.isAuth) {
      transition.redirect({name: 'signup'});
    } else {
      transition.next();
    }
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
