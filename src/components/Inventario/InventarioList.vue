<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4"
  >
    <div
      class="card w-auto bg-base-100 shadow-xl"
      v-for="(inventario, index) in inventarios"
      :key="index"
    >
      <div class="card-body">
        <h2 class="card-title">Inventario</h2>
        <p>Medicamento: {{ inventario.id_medicamento.nombre }}</p>
        <div class="card-actions">
          <button
            class="btn btn-primary"
            @click="$router.push(`/inventario/${inventario._id}`)"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type Inventario from "@/interfaces/inventario.interface";
import { getInventarios } from "@/services/inventario.service";
import { defineComponent } from "vue";

export default defineComponent({
  name: "inventario-list",
  data() {
    return {
      inventarios: [] as Inventario[],
    };
  },
  methods: {
    async loadInventarios() {
      try {
        const response = await getInventarios();
        this.inventarios = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.loadInventarios();
  },
});
</script>
