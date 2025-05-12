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
let mensagens = ref([]);
let dadosAssociation = ref([]);
let dadosAuthentication = ref([]);
let dadosHandshake = ref([]);


onMounted(() => {
  socket = new WebSocket('ws://localhost:3001');

  socket.onopen = () => {
    console.log("WebSocket conectador!");
    mensagens.value = ['✅ Conectado ao WebSocket!'];
  };

  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg && typeof msg === 'object' && 'tipo' in msg && 'dados' in msg) {
        switch (msg.tipo) {
          case 'association':
            dadosAssociation.value = (msg.dados);
            break;
          case 'authentication':
            dadosAuthentication.value = (msg.dados);
            break;
          case 'handshake':
            dadosHandshake.value = (msg.dados);
            console.log(dadosHandshake.value);
            
            break;
          default:
            console.warn('Tipo de dado desconhecido:', msg.tipo);
        }

        // Para depuração ou exibição genérica:
        mensagens.value = [`📦 ${msg.dados.length} documentos recebidos de ${msg.tipo}`];
      } else {
        mensagens.value = ['Formato inesperado de dados.'];
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      mensagens.value = ['Erro ao processar dados recebidos.'];
    }
  };

  socket.onclose = () => {
    mensagens.value = ['❌ Desconectado do WebSocket.'];
  };

  socket.onerror = (error) => {
    mensagens.value = ['⚠️ Erro no WebSocket'];
    console.error(error);
  };
});

</script>
