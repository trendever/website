<template lang="jade">

a.photos__link(
  v-link="{name: 'product_detail', params: {id: product.id}}")
  img.photos__image.photo-item__column-3(
   :src="product.instagram_image_url | url_thumbnail 306")

</template>

<script type="text/ecmascript-6">
  export default {
    props: [{ name: 'product', required: true }]
  }
</script>