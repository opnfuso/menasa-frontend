<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4"
    v-if="!loading"
  >
    <router-link
      to="/inventario/new"
      class="btn btn-primary w-auto shadow-xl h-auto"
      >Añadir</router-link
    >
    <div
      class="card w-auto bg-base-100 shadow-xl"
      v-for="(inventario, index) in inventarios"
      :key="index"
    >
      <div class="card-body">
        <h2 class="card-title">Inventario # {{ index + 1 }}</h2>
        <p>Medicamento: {{ inventario.id_medicamento.nombre }}</p>
        <p>Piezas Totales: {{ inventario.piezas }}</p>
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
import type { Inventario } from "@/interfaces/inventario.interface";
import { getInventarios } from "@/services/inventario.service";
import { defineComponent } from "vue";
import { getAuth } from "firebase/auth";

export default defineComponent({
  name: "inventario-list",
  data() {
    return {
      inventarios: [] as Inventario[],
      loading: true,
    };
  },
  methods: {
    async loadInventarios() {
      try {
        const auth = getAuth();
        const token = await auth.currentUser?.getIdToken(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await getInventarios(config);
        this.inventarios = response.data;
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.loadInventarios();
    this.loading = true;
  },
});
</script>
