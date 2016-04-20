<template lang="jade">

.photos__link-container-2
  a.photos__link(
    v-link="{name: 'product_detail', params: {id: product.id}}")
    img.photos__image.photo-item__column-2(
     :src="product.instagram_image_url | url_thumbnail 306")

  .photos__summ {{ DiscountPrice | curency_spaces }} #[i.ic-currency-rub]
  .photos__bottom-title {{{ product.Title | replace_incorrect_chars }}}

</template>

<script type="text/ecmascript-6">
  export default {
    props: [{ name: 'product', required: true }],
    computed: {
      DiscountPrice() {
        var DiscountPrice = this.$get('product.DiscountPrice');
        var Price = this.$get('product.Price');
        return (DiscountPrice > 1) ? DiscountPrice : (Price > 1) ? Price : '?';
      },
    },
  }
</script>