<style src='./style.pcss'></style>
<template lang="jade">
.inapp-notification(v-if="alert" transition="expand")
  img(v-el="alertData" v-bind:src="image")
  div.middle
    h2 Сообщение от @{{alertData.username}}
    span {{alertData.text}}
</template>

<script type="text/babel">
import * as messages from 'services/message';
import * as user from 'services/user';

export default {
  data(){
    return {
      class: "",
      alert: false,
      alertData: {
        image: "",
        title: "",
        text: ""
      }
    }
  },
  ready(){
    //In app notification
    messages.onMsg( this.onMessage );
  },
  methods:{
    onMessage(data){
        console.log("MESSAGE");
        console.log(data);

        let chat = data.response_map.chat;
        let messages = data.response_map.messages;
        let user_id = messages[0].user_id;
        let user = messages[0].user;
        let message = messages[0].parts[0];

        /*user.get({user_id}).then(function(data){
          console.log("USER!");
          console.log(data);
        })
        console.log(data);*/

        let alertData = {
          title: "Новое сообщение в чате", 
          text: message.content,
          username: user.name
        }

        if (messages[0].parts[0].mime_type == 'text/plain'){
          this.$set('alert',true);
          this.$set('alertData',alertData);
          setTimeout( () => this.$set('alert', false), 2000);
        }
    }
  }
}
</script>
