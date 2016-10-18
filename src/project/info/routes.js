export default function() {
  return {
    '/user': {
      name: 'info-user',
      component: require('./user/index.vue'),
    },

    '/mission': {
      name: 'info-mission',
      component: require('./mission/index.vue'),
    },

    '/agreement': {
      name: 'info-agreement',
      component: require('./agreement/index.vue'),
    },

    '/shop': {
      name: 'info-shop',
      component: require('./shop/index.vue'),
    },

    '/newshop': {
      name: 'info-newshop',
      component: require('./newshop/index.vue')
    },

    'instructions-first': {
      name: 'info-instructions-1',
      component: require('./instructions/instruction-first.vue')
    },

    'instructions-second': {
      name: 'info-instructions-2',
      component: require('./instructions/instruction-second.vue')
    }
  }

}
