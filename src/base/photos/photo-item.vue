<style src="./styles/photo-item.pcss"></style>
<template lang="jade">
.photo__container(class='{{ classForColumn }}', v-if='!error')
  a.photo__link(
    v-link='{name: "product_detail", params: {id: product.id}}')
    div(v-bind:style='{ opacity: imageOpacity }',
        :class='{"animate": animate}')
      img.photo__img(:src='thumb',
       v-on:load='showImage',
       v-on:error='loadError')
  .photo__description
    .photo__title {{ title | truncate 45 }}
    .photo__summ(v-if="discountPrice")
      span {{ discountPrice | curency_spaces }}
      i.ic-currency-rub
</template>

<script type='text/ecmascript-6'>
  import pluralize from 'pluralize-ru';
  import { urlThumbnail } from 'utils';
  import { getColumnNumber } from 'vuex/getters/products';
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

    methods: {
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
        count: getColumnNumber,
      },
    },
  }
</script>
