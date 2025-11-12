<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAllNfes, deleteNfe, exportNfes } from "../services/api";
import NfeDetailModal from "./NfeDetailModal.vue";

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
  issuerCNPJ: string;
  recipientName: string;
  recipientCNPJ: string;
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

// Função de exclusão
const handleDelete = async (accessKey: string, nfeNumber: number) => {
  if (!confirm(`Tem certeza que deseja excluir a NF-e número ${nfeNumber}?`)) {
    return;
  }
  error.value = null; 
  try {
    await deleteNfe(accessKey);
    emit('refreshData');
  } catch (err) {
    console.error("Falha ao excluir a NF-e:", err);
    error.value = 'Falha ao excluir a nota fiscal.';
  }
};

const handleExport = async () => {
  error.value = null;
  try {
    const response = await exportNfes();
    
    // Cria um objeto URL temporário para o 'blob' (o arquivo Excel)
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Tenta pegar o nome do arquivo do cabeçalho da resposta
    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'NotasFiscais.xlsx';
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (fileNameMatch && fileNameMatch.length === 2) {
        fileName = fileNameMatch[1];
      }
    }
    
    link.setAttribute('download', fileName);
    
    // Adiciona, clica e remove o link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error("Falha ao exportar:", err);
    error.value = 'Falha ao gerar o arquivo Excel.';
  }
};

onMounted(fetchData);
defineExpose({ fetchData });
</script>

<template>
  <div class="mt-12 mx-auto"> 
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold text-gray-700">Notas Processadas</h2>
      <button
        @click="handleExport"
        class="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center"
      >
        <i class="pi pi-file-excel mr-2"></i>
        Exportar para Excel
      </button>
    </div>

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