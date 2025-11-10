<script setup lang="ts">
import { ref } from 'vue';
import { uploadNfe } from './services/api';
import NfeDashboard from './components/NfeDashboard.vue';

const selectedFile = ref<File | null>(null);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Permite chamar a função 'fetchData' de dentro dele
const dashboard = ref<InstanceType<typeof NfeDashboard> | null>(null);

const onFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    selectedFile.value = target.files[0];
    errorMessage.value = null;
    successMessage.value = null;
  }
};

const handleSubmit = async () => {
  if (!selectedFile.value) {
    errorMessage.value = 'Por favor, selecione um arquivo XML.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  try {
    const response = await uploadNfe(selectedFile.value);
    successMessage.value = `Nota Fiscal ${response.data.number} processada com sucesso!`;

    // Chama a função 'fetchData' do dashboard para atualizar a tabela
    dashboard.value?.fetchData();

  } catch (error: any) {
    console.error(error);
    errorMessage.value = error.response?.data || 'Erro ao processar o arquivo.';
  } finally {
    isLoading.value = false;
    // Limpa a seleção de arquivo após o envio
    (document.getElementById('file-upload') as HTMLInputElement).value = '';
    selectedFile.value = null;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">

      <div class="w-full p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold text-center text-gray-800">
          Processador de NF-e
        </h1>
        <p class="text-center text-gray-500">
          Faça o upload de um arquivo .xml de Nota Fiscal Eletrônica.
        </p>

        <div class="space-y-4">
          <label 
            for="file-upload" 
            class="flex justify-center w-full px-6 py-12 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500">
            <span class="space-y-2 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="block text-sm font-medium text-gray-600">
                {{ selectedFile ? selectedFile.name : 'Clique para selecionar um arquivo .xml' }}
              </span>
              <span class="block text-xs text-gray-500">
                XML (máx. 10MB)
              </span>
            </span>
            <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="onFileSelect" accept=".xml, text/xml">
          </label>

          <button 
            @click="handleSubmit" 
            :disabled="isLoading || !selectedFile" 
            class="w-full px-4 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {{ isLoading ? 'Processando...' : 'Enviar e Processar NF-e' }}
          </button>
        </div>

        <div v-if="successMessage" class="p-3 text-green-800 bg-green-100 rounded-md">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="p-3 text-red-800 bg-red-100 rounded-md">
          {{ errorMessage }}
        </div>

      </div>

      <NfeDashboard ref="dashboard" />

    </div>
  </div>
</template>