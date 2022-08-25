<template>
  <div class="overflow-x-auto p-4">
    <div class="grid grid-cols-6 gap-4">
      <h1 class="col-span-3 text-3xl font-bold mb-8">Lista de Precios</h1>
      <button @click="addMedicamento()" class="btn btn-primary min-w-fit">
        Añadir
      </button>
      <button class="btn btn-success min-w-fit">Guardar</button>
      <button class="btn btn-error w-full">Eliminar</button>
    </div>
    <table class="table table-compact w-full">
      <thead>
        <tr>
          <!-- <th></th> -->
          <th></th>
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
          <td>
            <input type="checkbox" class="checkbox" checked="false" />
          </td>
          <td>
            <input
              class="input w-full"
              type="text"
              v-model="medicamento.nombre"
            />
          </td>
          <td>
            <input
              class="input w-full"
              type="text"
              v-model="medicamento.compuesto_activo"
            />
          </td>
          <td>
            <input
              class="input w-full"
              type="text"
              v-model="medicamento.laboratorio"
            />
          </td>
          <td>
            <input
              class="input w-full"
              type="text"
              v-model="medicamento.codigo_barras"
            />
          </td>
          <td>
            <input
              class="input w-full"
              type="text"
              v-model="medicamento.precio"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import type { Medicamento } from "@/interfaces/medicamento.interface";
import { getMedicamentos } from "@/services/medicamento.service";
import { createMedicamento } from "@/services/medicamento.service";
import type { MedicamentoCreate } from "@/interfaces/medicamento.interface";
import { getAuth } from "firebase/auth";
import { defineComponent } from "vue";
import Multiselect from "vue-multiselect";
import Swal from "sweetalert2";

export default defineComponent({
  name: "medicamento-list",
  data() {
    return {
      medicamentos: [] as Medicamento[],
      medicamento: {} as MedicamentoCreate,
      modifieds: [] as number[],
      value: null,
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
    async addMedicamento() {
      try {
        if (this.medicamento === undefined) {
          this.medicamentos = [];
        }
        this.medicamentos.push({});
      } catch (error) {
        Swal.fire("Error", "Error al crear el medicamento", "error");
        console.error(error);
      }
    },
    // async saveMedicamento() {
    //   try {
    //     const auth = getAuth();
    //     const token = await auth.currentUser?.getIdToken(true);
    //     const config = {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     };

    //   } catch (error) {
    //     Swal.fire("Error", "Error al guardar el/los medicamento/s", "error");
    //     console.error(error);
    //   }
    // },
  },
  mounted() {
    this.loadMedicamentos();
  },
});
</script>
