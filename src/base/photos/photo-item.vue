<style src="./styles/photo-item.pcss"></style>
<template lang="jade">
.photo__container(class='{{ classForColumn }}', v-if='!error', @click="goToProduct")
  .photo__img-space
    img.photo__img(
        :src='thumb',
        v-on:load='showImage',
        v-on:error='loadError',
        v-bind:style='{ opacity: imageOpacity }',
        :class='{"animate": animate}'
      )
  .photo__description
    .photo__title {{ title | truncate '20'}}
    .photo__row
     .photo__shopTitle Shop Title
     .photo__summ(v-if="discountPrice")
      | {{ discountPrice | curency_spaces }} 
      span ₽
</template>

<script type='text/babel'>
  import pluralize from 'pluralize-ru';
  import { urlThumbnail } from 'utils';
  import { getColumnCount } from 'vuex/getters/products';
  export default {
    data(){
      return {
        imageOpacity: 0,
        error: false,
      };
    },

    props: [
      {
        name: 'product',
        required: true
      },
      {
        name: 'animate',
        default: true
      }
    ],
    filters: {
  
    truncate: function(string, value) {
        return string.substring(0, value) + '...';
    }
  
  },

    methods: {
      goToProduct(){

        this.$router.go( { name: "product_detail", params: { id: this.product.id } } );

      },
      showImage(){
        this.imageOpacity = 1;
      },
      loadError(){
        this.error = true;
      }
    },

    computed: {
      thumb() {
        if (this.product && this.product.instagram_images) {
          return this.product.instagram_images
          .find((img) => img.name === "M_square").url
        }
        // return this.product.instagram_image_url
      },
      classForColumn() {
        switch(this.count){
          case 2: return 'photo__container-two';
            break;
          case 3: return 'photo__container-three';
            break;
          default: return 'photo__container-three';
        }
      },
      discountPrice() {
        const items = this.product.items;
        if (items.length === 0) {
          return
        }
        if (items[0].discount_price) {
          return items[0].discount_price;
        } else if (items[0].price) {
          return items[0].price
        }
      },
      title() {
        const items = this.product.items;
        if (items.length === 0) {
          return this.product.title;
        } else if (items.length > 1) {
          return `${items[0].name} (+${pluralize(items.length-1, '', '%d товар', '%d товара', '%d товаров')})`
        }
        return items[0].name
      }
    },

    vuex: {
      getters: {
        count: getColumnCount,
      },
    },
  }
</script>