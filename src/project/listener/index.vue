<template lang="jade">

</template>

<script type='text/babel'>

  import * as messages from 'services/message'
  import * as products from 'services/products'
  import * as leads from 'services/leads'
  import * as product from 'vuex/actions/products.js'
  import * as lead from 'vuex/actions/lead.js'
  import * as chat from 'vuex/actions/chat.js'
  import { isAuth } from 'vuex/getters/user.js'

  export default {
    mounted() {
      this.onMessage     = this.onMessage.bind( this )
      this.onMessageRead = this.onMessageRead.bind( this )
      this.onProductNew  = this.onProductNew.bind( this )
      this.on            = this.on.bind( this )
      this.off           = this.off.bind( this )
      if ( this.isAuth ) {
        this.on()
      }
    },
    beforeDestroy(){
      this.off()
    },
    methods: {
      onProductNew( { response_map } ){
        this.onProductNewProduct( response_map.object_list[ 0 ], true );
      },
      onMessage( data ) {
        this.onMessagesLead( data )
        this.onMessagesChat( data )
      },
      onMessageRead( data ) {
        this.onMessageReadLead( data )
      },
      on() {
        this.init().then( () => {
          messages.onMsg( this.onMessage )
          messages.onMsgRead( this.onMessageRead )
          products.onNew( this.onProductNew )
        } )
      },
      off() {
        messages.offMsg( this.onMessage )
        messages.offMsgRead( this.onMessageRead )
        products.offNew( this.onProductNew )
      }
    },
    watch: {
      isAuth( isAuth ){
        isAuth ? this.on() : this.off()
      }
    },
    vuex: {
      actions: {
        init: lead.init,
        onMessagesLead: lead.onMessages,
        onMessagesChat: chat.onMessages,
        onMessageReadLead: lead.onMessageRead,
        onProductNewProduct: product.setLike
      },
      getters: {
        isAuth,
      }
    },
  }
</script>
