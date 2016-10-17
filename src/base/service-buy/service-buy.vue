<template lang="jade">

#service-buy
  slot


</template>

<script>
import { createLead } from 'vuex/actions/lead';

export default {
  props:{
    productId: {
      type: Number
    }
  },
  vuex: {
    actions:{
      createLead
    }
  },
  methods:{
    buyTg(){
      this
        .createLead( this.productId )
        .then(
          ( lead ) => {
            if ( lead !== undefined && lead !== null ) {
              this.$router.go( { name: 'chat', params: { id: lead.id } } )
            }
          }
        )
        .catch(
          ( error ) => {
            if ( error === leads.ERROR_CODES.UNATHORIZED ) {
              this.$router.go( { name: 'signup' } )
            }
           }
        )
    }
  }
};
</script>

<style lang="postcss">

#service-buy {
  display: inline-block;
}

</style>
