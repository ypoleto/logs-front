<template>
  <div>
    <TablesPage :dadosAssociation="dadosAssociation" :dadosAuthentication="dadosAuthentication"
      :dadosHandshake="dadosHandshake" />
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import TablesPage from './tablesPage.vue';

let socket;
let dadosAssociation = ref([]);
let dadosAuthentication = ref([]);
let dadosHandshake = ref([]);


onMounted(() => {
  socket = new WebSocket('ws://192.168.7.3:3000');

  socket.onopen = () => {
    console.log('✅ Conectado ao WebSocket!');
  };

  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg && typeof msg === 'object' && 'tipo' in msg && 'dados' in msg) {
        switch (msg.tipo) {
          case 'association':
            dadosAssociation.value = msg.dados;
            localStorage.setItem('dadosAssociation', JSON.stringify(msg.dados));
            break;
          case 'authentication':
            dadosAuthentication.value = msg.dados;
            localStorage.setItem('dadosAuthentication', JSON.stringify(msg.dados));
            break;
          case 'handshake':
            dadosHandshake.value = msg.dados;
            localStorage.setItem('dadosHandshake', JSON.stringify(msg.dados));
            break;
          default:
            console.warn('Tipo de dado desconhecido:', msg.tipo);
        }
      } else {
        console.log('Formato inesperado de dados.');
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      console.log('Erro ao processar dados recebidos.');
    }
  };

  socket.onclose = () => {
    console.log('❌ Desconectado do WebSocket.');
  };

  socket.onerror = (error) => {
    console.log('⚠️ Erro no WebSocket');
    console.error(error);
  };

  // Carregar dados do localStorage, se existirem
  const savedDadosAssociation = localStorage.getItem('dadosAssociation');
  if (savedDadosAssociation) {
    dadosAssociation.value = JSON.parse(savedDadosAssociation);
  }

  const savedDadosAuthentication = localStorage.getItem('dadosAuthentication');
  if (savedDadosAuthentication) {
    dadosAuthentication.value = JSON.parse(savedDadosAuthentication);
  }

  const savedDadosHandshake = localStorage.getItem('dadosHandshake');
  if (savedDadosHandshake) {
    dadosHandshake.value = JSON.parse(savedDadosHandshake);
  }
});

</script>
