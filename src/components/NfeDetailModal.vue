<script setup lang="ts">
type Product = {
  id: string;
  productCode: string;
  name: string;
  quantity: number;
  totalValue: number;
};

type Nfe = {
  number: string;
  issuerName: string;
  issuerCNPJ: string;
  recipientName: string;
  recipientCNPJ: string;
  totalValue: number;
  icmsValue: number;
  ipiValue: number;
  issueDate: string;
  products: Product[];
};

// Ele espera um objeto 'nfe' e uma função 'onClose'
defineProps<{
  nfe: Nfe; // Reusa a interface definida no NfeDashboard
  onClose: () => void;
}>();

// Formata a data para exibição
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR');
};

// Formata valores monetários
const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
</script>

<template>
  <div 
    @click="onClose" 
    class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">

    <div 
      @click.stop class="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto z-50">

      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-2xl font-semibold text-gray-800">Detalhes da NF-e: {{ nfe.number }}</h3>
        
        <button 
          @click="onClose" 
          class="w-7 h-7 flex items-center justify-center rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors focus:outline-none"
        >
          <span class="text-xl font-bold leading-none mb-1">&times;</span>
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="bg-gray-50 p-3 rounded-md">
            <h4 class="font-bold text-gray-700">Emitente</h4>
            <p>{{ nfe.issuerName }}</p>
            <p>CNPJ: {{ nfe.issuerCNPJ }}</p>
          </div>
          <div class="bg-gray-50 p-3 rounded-md">
            <h4 class="font-bold text-gray-700">Destinatário</h4>
            <p>{{ nfe.recipientName }}</p>
            <p>CNPJ: {{ nfe.recipientCNPJ }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-center">
          <div class="bg-blue-50 p-3 rounded-md">
            <h4 class="font-bold text-blue-800">Valor Total</h4>
            <p class="text-lg">{{ formatCurrency(nfe.totalValue) }}</p>
          </div>
          <div class="bg-green-50 p-3 rounded-md">
            <h4 class="font-bold text-green-800">ICMS</h4>
            <p class="text-lg">{{ formatCurrency(nfe.icmsValue) }}</p>
          </div>
          <div class="bg-red-50 p-3 rounded-md">
            <h4 class="font-bold text-red-800">IPI</h4>
            <p class="text-lg">{{ formatCurrency(nfe.ipiValue) }}</p>
          </div>
          <div class="bg-gray-50 p-3 rounded-md">
            <h4 class="font-bold text-gray-700">Data de Emissão</h4>
            <p class="text-lg">{{ formatDate(nfe.issueDate) }}</p>
          </div>
        </div>

        <div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">Produtos da Nota</h4>
          <div class="overflow-x-auto shadow-md rounded-lg border">
            <table class="min-w-full divide-y divide-gray-200 bg-white">
              <thead class="bg-gray-800 text-white">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium uppercase">Código</th>
                  <th class="px-4 py-2 text-left text-xs font-medium uppercase">Nome</th>
                  <th class="px-4 py-2 text-center text-xs font-medium uppercase">Qtd.</th>
                  <th class="px-4 py-2 text-right text-xs font-medium uppercase">Valor Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="product in nfe.products" :key="product.id" class="hover:bg-gray-50">
                  <td class="px-4 py-2 whitespace-nowrap">{{ product.productCode }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">{{ product.name }}</td>
                  <td class="px-4 py-2 text-center">{{ product.quantity }}</td>
                  <td class="px-4 py-2 text-right">{{ formatCurrency(product.totalValue) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>