/* globals mixpanel */
import store from 'vuex/store';

export function configRouter(router) {
  router.map({
    '/': {
      name: 'home',
      component: require('./project/product-list/index.vue')
    },

    '/product/:id': {
      name: "product_detail",
      component: require('./project/product-detail/index.vue')
    },

    '/product/:id/repost': {
      name: "product_repost",
      component: require('./project/product-detail/repost.vue')
    },

    '/chat': {
      name: "chat_list",
      auth: true,
      component: require('./project/chat-list/index.vue'),
    },

    '/chat/:id': {
      name: "chat",
      auth: true,
      component: require('./project/chat/index.vue'),
    },

    //'/wall': {
    //  name: 'wall',
    //  component: require('./components/wall/index.vue')
    //},

    // Info pages
    '/why': {
      name: 'why',
      component: function(resolve) {
        require(['./_components/why/index.vue'], resolve);
      }
    },

    '/agreement': {
      name: 'agreement',
      component: function(resolve) {
        require(['./_components/agreement/index.vue'], resolve);
      }
    },

    '/guide': {
      name: 'guide',
      component: function(resolve) {
        require(['./_components/guide/index.vue'], resolve);
      }
    },

    '/info/:type': {
      name: 'info',
      component: require('./project/info/info.vue')
    },

    '/hello': {
      name: 'hello',
      component: require('./project/subscribe/hello.vue')
    },

    // '/subscribe': {
    //   name: 'subscribe',
    //   component: require('./project/subscribe/subscribe.vue')
    // },

    '/settings/tracking': {
      name: 'settings-tracking',
      component: require('./_components/settings-tracking/index.vue')
    },

    '/signup': {
      name: 'signup',
      component: require('project/auth/signup.vue')
    },

    '/comfirm-sms': {
      name: 'comfirm-sms',
      component: require('project/auth/comfirm-sms.vue')
    },

    // not found handler
    '*': {
      name: '404',
      component: require('./_components/not-found.vue')
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
    window.scrollToTop(0, 0);

    // Mixpanel
    var data = {
      toPath: transition.to.path,
      toName: transition.to.name
    };
    if (transition.from) {
      data.fromPath = transition.from.path;
      data.fromName = transition.from.name;
    }
    mixpanel.track("Page: " + transition.to.name, data);
  });
}
