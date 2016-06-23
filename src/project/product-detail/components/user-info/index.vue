<template>
  <div class="user-info">
    <img class="avatar" :src="img">
    <div class="description">
      <div class="userName">
        <span class="title">Нашёл</span>
        <span class="name">{{name}}</span>
      </div>
      <span class="code">Код товара {{code}}</span>
    </div>
    <span class="lastUpdate">{{lastUpdate}}</span>
  </div>
</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">
  export default {
    props: {
      img: {
        type: String,
        required: true
      },
      code: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      lastUpdate: {
        type: String,
        required: true
      }
    }
  }
</script>
