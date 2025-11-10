<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getNfeStats } from "../services/api";

// Interface para os dados das estatísticas
interface NfeStats {
  totalNotes: number;
  totalValue: number;
  totalIcms: number;
  totalIpi: number;
}

// Estado reativo
const stats = ref<NfeStats>({
  totalNotes: 0,
  totalValue: 0,
  totalIcms: 0,
  totalIpi: 0,
});
const isLoading = ref(true);

// Formata valores monetários
const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

// Função para buscar os dados
const fetchData = async () => {
  isLoading.value = true;
  try {
    const response = await getNfeStats();
    stats.value = response.data;
  } catch (err) {
    console.error("Falha ao buscar estatísticas:", err);
  } finally {
    isLoading.value = false;
  }
};

// Hook 'onMounted'
onMounted(fetchData);

// Exporta a função para que o App.vue possa chamá-la
defineExpose({ fetchData });
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
    <div class="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
      <h3 class="text-sm font-medium text-gray-500 uppercase whitespace-nowrap">
        Total de Notas
      </h3>
      <p v-if="isLoading" class="text-2xl font-bold text-gray-800 mt-1">...</p>
      <p v-else class="text-2xl font-bold text-gray-800 mt-1">
        {{ stats.totalNotes }}
      </p>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
      <h3 class="text-sm font-medium text-gray-500 uppercase whitespace-nowrap">
        Valor Total (NF-e)
      </h3>
      <p v-if="isLoading" class="text-2xl font-bold text-gray-800 mt-1">...</p>
      <p v-else class="text-2xl font-bold text-gray-800 mt-1">
        {{ formatCurrency(stats.totalValue) }}
      </p>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
      <h3 class="text-sm font-medium text-gray-500 uppercase whitespace-nowrap">
        Total ICMS
      </h3>
      <p v-if="isLoading" class="text-2xl font-bold text-gray-800 mt-1">...</p>
      <p v-else class="text-2xl font-bold text-gray-800 mt-1">
        {{ formatCurrency(stats.totalIcms) }}
      </p>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
      <h3 class="text-sm font-medium text-gray-500 uppercase whitespace-nowrap">
        Total IPI
      </h3>
      <p v-if="isLoading" class="text-2xl font-bold text-gray-800 mt-1">...</p>
      <p v-else class="text-2xl font-bold text-gray-800 mt-1">
        {{ formatCurrency(stats.totalIpi) }}
      </p>
    </div>
  </div>
</template>
