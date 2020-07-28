import io from "socket.io-client"
import store from '@/store'
import Vue from 'vue'
import VueSocketIOExt from 'vue-socket.io-extended';

const socket = io('http://localhost:8002', {
  autoConnect: false,
  query: {
    token: store.getters.token
  }
});

socket.on('disconnect', function(){
    console.log('[notifications-socket] disconnected')
});

socket.on('connect', () => {
  console.log('[notifications-socket] connected')
});

socket.on('comment_notification', function () {
    console.log('COMMENT NOTIFICATION WOLOLOLO')
});

Vue.use(VueSocketIOExt, socket, { store });