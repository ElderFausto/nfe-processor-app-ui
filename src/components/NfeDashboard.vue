<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllNfes } from '../services/api';

// Tipos para os dados (para o TypeScript)
interface NfeProduct {
  id: number;
  name: string;
  quantity: number;
  totalValue: number;
}
interface Nfe {
  accessKey: string;
  number: number;
  issueDate: string;
  issuerName: string;
  recipientName: string;
  totalValue: number;
  products: NfeProduct[];
}

// Estado reativo
const nfes = ref<Nfe[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Função para buscar os dados
const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await getAllNfes();
    nfes.value = response.data;
  } catch (err) {
    error.value = 'Falha ao buscar as notas fiscais.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

// Hook 'onMounted' (executa quando o componente é criado)
onMounted(fetchData);

// Exporta a função para que o App.vue possa chamá-la
defineExpose({ fetchData });
</script>

<template>
  <div class="mt-12">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Notas Processadas</h2>

    <div v-if="isLoading" class="text-center p-4 text-gray-500">Carregando notas...</div>
    <div v-if="error" class="p-3 text-red-800 bg-red-100 rounded-md">{{ error }}</div>

    <div v-if="!isLoading && !error" class="overflow-x-auto shadow-md rounded-lg">
      <table class="min-w-full divide-y divide-gray-200 bg-white">
        <thead class="bg-gray-800 text-white">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Número</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Emitente</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Destinatário</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Valor Total</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="nfes.length === 0">
            <td colspan="4" class="px-6 py-4 text-center text-gray-500">Nenhuma nota fiscal processada ainda.</td>
          </tr>
          <tr v-for="nfe in nfes" :key="nfe.accessKey" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">{{ nfe.number }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ nfe.issuerName }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ nfe.recipientName }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ nfe.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>