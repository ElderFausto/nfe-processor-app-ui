<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAllNfes, deleteNfe } from "../services/api";
import NfeDetailModal from "./NfeDetailModal.vue";

// Interface Nfe aqui para reutilização
interface NfeProduct {
  id: number;
  productCode: string;
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
  icmsValue: number;
  ipiValue: number;
  products: NfeProduct[];
  natureOfOperation: string;
}

// Estado reativo
const nfes = ref<Nfe[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const selectedNfe = ref<Nfe | null>(null);

// Emite evento para o componente pai
const emit = defineEmits(['refreshData']);

// Função para buscar os dados
const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await getAllNfes();
    nfes.value = response.data;
  } catch (err) {
    error.value = "Falha ao buscar as notas fiscais.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const handleDelete = async (accessKey: string, nfeNumber: number) => {
  // Pede confirmação do usuário
  if (!confirm(`Tem certeza que deseja excluir a NF-e número ${nfeNumber}?`)) {
    return;
  }

  error.value = null; // Limpa erros antigos

  try {
    await deleteNfe(accessKey);
    // Recarrega os dados após exclusão
    emit('refreshData');

  } catch (err) {
    console.error("Falha ao excluir a NF-e:", err);
    error.value = 'Falha ao excluir a nota fiscal.';
  }
};

// Busca os dados ao montar o componente
onMounted(fetchData);

// Torna a função fetchData acessível para o componente pai
defineExpose({ fetchData });
</script>

<template>
  <div class="mt-12 mx-auto overflow-x-auto">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Notas Processadas</h2>

    <div v-if="isLoading" class="text-center p-4 text-gray-500">
      Carregando notas...
    </div>
    <div v-if="error" class="p-3 text-red-800 bg-red-100 rounded-md">
      {{ error }}
    </div>

    <div v-if="!isLoading && !error" class="shadow-md rounded-lg overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 bg-white">
        <thead class="bg-gray-800 text-white">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Número
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Emitente
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Destinatário
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
              Valor Total
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="nfes.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
              Nenhuma nota fiscal processada ainda.
            </td>
          </tr>

          <tr
            v-for="nfe in nfes"
            :key="nfe.accessKey"
            class="hover:bg-gray-100"
          >
            <td @click="selectedNfe = nfe" class="px-6 py-4 whitespace-nowrap cursor-pointer">{{ nfe.number }}</td>
            <td @click="selectedNfe = nfe" class="px-6 py-4 whitespace-nowrap cursor-pointer">{{ nfe.issuerName }}</td>
            <td @click="selectedNfe = nfe" class="px-6 py-4 whitespace-nowrap cursor-pointer">{{ nfe.recipientName }}</td>
            <td @click="selectedNfe = nfe" class="px-6 py-4 whitespace-nowrap cursor-pointer">
              {{
                nfe.totalValue.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click.stop="handleDelete(nfe.accessKey, nfe.number)"
                class="text-gray-500 hover:text-red-600"
              >
                <i class="pi pi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <NfeDetailModal
    v-if="selectedNfe"
    :nfe="selectedNfe"
    @close="selectedNfe = null"
  />
</template>