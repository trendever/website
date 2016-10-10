<template>
  <div class="user-info">
    <img class="avatar" :src="img" v-link='{name: "user", params: {id: name}}'>
    <div class="description">
      <div class="userName">
        <span class="title" v-link='{name: "user", params: {id: name}}'>Нашёл</span>
        <span class="name" v-link='{name: "user", params: {id: name}}'>{{name}}</span>
      </div>
      <span class="code">{{code}}, {{ lastUpdate}}</span>
    </div>
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
