<template>
  <div class="overflow-x-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Lista de Precios</h1>
    <table class="table table-compact w-full">
      <thead>
        <tr>
          <!-- <th></th> -->
          <th>Medicamento</th>
          <th>Sal-Compuesto Activo</th>
          <th>Laboratorio</th>
          <th>Codigo de Barras</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody v-for="(medicamento, index) in medicamentos" :key="index">
        <tr>
          <!-- <th>{{ index + 1 }}</th> -->
          <td>{{ medicamento.nombre }}</td>
          <td>{{ medicamento.compuesto_activo }}</td>
          <td>{{ medicamento.laboratorio }}</td>
          <td>{{ medicamento.codigo_barras }}</td>
          <td>{{ medicamento.precio }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import type { Medicamento } from "@/interfaces/medicamento.interface";
import { getMedicamentos } from "@/services/medicamento.service";
import { getAuth } from "firebase/auth";
import { defineComponent } from "vue";

export default defineComponent({
  name: "medicamento-list",
  data() {
    return {
      medicamentos: [] as Medicamento[],
    };
  },
  methods: {
    async loadMedicamentos() {
      try {
        const auth = getAuth();
        const token = await auth.currentUser?.getIdToken(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await getMedicamentos(config);
        this.medicamentos = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.loadMedicamentos();
  },
});
</script>
