import mixpanel from 'mixpanel-browser'
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
      component: function(resolve) {
        require(['project/why/index.vue'], resolve);
      }
    },

    '/agreement': {
      name: 'agreement',
      component: function(resolve) {
        require(['project/agreement/index.vue'], resolve);
      }
    },

    '/info/:type': {
      name: 'info',
      component: function(resolve) {
        require(['project/info/info.vue'], resolve);
      }
    },

    '/settings/tracking': {
      name: 'settings-tracking',
      component: function(resolve) {
        require(['project/settings-tracking/index.vue'], resolve);
      }
    },

    '/settings/token': {
      name: 'settings-token',
      auth: true,
      component: function(resolve) {
        require(['project/settings-token/index.vue'], resolve);
      }
    },

    '/logout': {
      name: 'logout',
      auth: true,
      component: function(resolve) {
        require(['project/logout/index.vue'], resolve);
      }
    },

    '/signup': {
      name: 'signup',
      component: require('project/auth/signup.vue')
    },

    '/confirm-sms': {
      name: 'comfirm-sms',
      component: require('project/auth/confirm-sms.vue')
    },

    // not found handler
    '*': {
      component: function(resolve) {
        require(['project/not-found/index.vue'], resolve);
      }
    },

    '/404': {
      name: '404',
      component: function(resolve) {
        require(['project/not-found/index.vue'], resolve);
      }
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
