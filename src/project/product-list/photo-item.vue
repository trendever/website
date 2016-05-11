<template lang="jade">
.photo__container(class="{{ classForColumn }}")
  a.photo__link(
    v-link="{name: 'product_detail', params: {id: product.id}}")
    img.photo__img(:src="product.instagram_image_url | url_thumbnail 306")
  .photo__description
    .photo__title {{title}}
    .photo__summ
      span {{ discountPrice | curency_spaces }}
      i.ic-currency-rub
</template>

<script type="text/ecmascript-6">
  import pluralize from 'pluralize-ru';
  import { getColumnNumber } from 'vuex/getters';
  export default {
    props: [
      {
        name: 'product',
        required: true
      }
    ],
    computed: {

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
          return '?';
        }
        if (items[0].discount_price) {
          return items[0].discount_price;
        } else if (items[0].price) {
          return items[0].price
        }
        return '?'
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