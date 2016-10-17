<template lang="jade">

#service-buy(@click="serviceBuy")
  slot


</template>

<script>
import { createLead } from 'vuex/actions/lead';

export default {
  props:{
    productId: {
      type: Number,
      required: true
    }
  },
  vuex: {
    actions:{
      createLead
    }
  },
  methods:{
    serviceBuy(){
      if(!this.productId) {
        return;
      }


      this
        .createLead( this.productId )
        .then(
          ( lead ) => {
            if ( lead !== undefined && lead !== null ) {
              this.$router.go( { name: 'chat', params: { id: lead.id } } )
            }
          }
        );
    }
  }
};
</script>

<style lang="postcss">

#service-buy {
  display: inline-block;
  width: 100%;
}

</style>
