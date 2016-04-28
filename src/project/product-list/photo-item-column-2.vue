<template lang="jade">

.photos__link-container-2
  a.photos__link(
    v-link="{name: 'product_detail', params: {id: product.id}}")
    img.photos__image.photo-item__column-2(
     :src="product.instagram_image_url | url_thumbnail 306")

  .photos__summ {{ DiscountPrice | curency_spaces }} #[i.ic-currency-rub]
  .photos__bottom-title {{{ Title }}}

</template>

<script type="text/ecmascript-6">
  import pluralize from 'pluralize-ru';

  export default {
    props: [{ name: 'product', required: true }],
    computed: {
      DiscountPrice() {
        let items = this.product.items;
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
      Title() {
        let items = this.product.items;
        if (items.length === 0) {
          return this.product.title;
        } else if (items.length > 1) {
          return `${items[0].name} (+${pluralize(items.length-1, '', '%d товар', '%d товара', '%d товаров')})`
        }
        return items[0].name
      }
    },
  }
</script>