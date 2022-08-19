<template>
  <main class="flex flex-col pt-6 pb-12 pr-12 pl-12" v-if="!loading">
    <form @submit.prevent="handleUpdate()">
      <div class="grid grid-cols-4 gap-4">
        <h1 class="col-span-3 text-3xl font-bold mb-8">Inventario</h1>
        <button class="btn btn-primary min-w-fit">Guardar</button>
      </div>
      <!-- Medicamento -->
      <div class="w-full rounded-xl bg-base-300 p-4 mb-8 shadow-2xl/40">
        <h2 class="text-2xl font-semibold mb-4">Medicamento</h2>
        <div class="mb-4 grid grid-cols-1 gap-4">
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Nombre</label>
            <input
              class="input w-full"
              type="text"
              v-model="inventario.id_medicamento.nombre"
            />
          </div>
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Compuesto Activo</label>
            <input
              class="input w-full"
              type="text"
              v-model="inventario.id_medicamento.compuesto_activo"
            />
          </div>
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Codigo de barras</label>
            <input
              type="number"
              min="0"
              class="input w-full"
              v-model="inventario.id_medicamento.codigo_barras"
            />
          </div>
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Precio</label>
            <input
              type="number"
              min="0"
              step="0.01"
              class="input w-full"
              v-model="inventario.id_medicamento.precio"
            />
          </div>
        </div>
      </div>
      <!-- Información -->
      <div class="w-full rounded-xl bg-base-300 p-4 mb-8 shadow-2xl/40">
        <h2 class="text-2xl font-semibold mb-4">Información</h2>
        <div class="mb-4 grid grid-cols-1 gap-4">
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Piezas</label>
            <input
              type="number"
              class="input w-full"
              v-model="inventario.piezas"
            />
          </div>
        </div>
      </div>
      <!-- Lotes -->
      <div class="w-full rounded-xl bg-base-300 p-4 mb-8 shadow-2xl/40">
        <h2 class="text-2xl font-semibold mb-4">Lotes</h2>
        <div v-for="(lote, index) in inventario.lotes" :key="index">
          <h3 class="text-xl mb-4 font-semibold">Lote : {{ lote.lote }}</h3>
          <div class="mb-4 grid grid-cols-1 gap-4">
            <div class="flex flex-col">
              <label for="date" class="mb-2 font-semibold"
                >Fecha de vencimiento</label
              >
              <input
                type="date"
                class="input w-full"
                v-model="lote.fecha_vencimiento_string"
              />
            </div>
            <div class="flex flex-col">
              <label for="text" class="mb-2 font-semibold"
                >Cantidad de medicamento</label
              >
              <input type="number" class="input w-full" value="5" />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Observaciones</label>
              <textarea
                class="textarea textarea-bordered"
                v-model="lote.observaciones"
              ></textarea>
            </div>
          </div>
          <div class="divider"></div>
        </div>
      </div>
    </form>
  </main>
</template>

<script lang="ts">
import type {
  Inventario,
  InventarioUpdate,
} from "@/interfaces/inventario.interface";
import { getInventario, updateInventario } from "@/services/inventario.service";
import { updateMedicamento } from "@/services/medicamento.service";
import { defineComponent } from "vue";
import Swal from "sweetalert2";

export default defineComponent({
  name: "inventario-detail",
  data() {
    return { inventario: {} as Inventario, loading: true };
  },
  methods: {
    async loadInventario(id: string) {
      try {
        const response = await getInventario(id);
        this.loading = false;
        this.inventario = response.data;
        this.inventario.lotes.map((lote) => {
          const date = new Date(lote.fecha_vencimiento);
          lote.fecha_vencimiento_string = date.toISOString().split("T")[0];
        });
      } catch (error) {
        console.error(error);
      }
    },
    async handleUpdate() {
      try {
        Swal.fire({
          title: "¿Estás seguro?",
          text: "¿Estás seguro de actualizar el inventario?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, actualizar",
          cancelButtonText: "No, cancelar",
        }).then(async (result) => {
          if (result.value) {
            const inventarioUpdate: InventarioUpdate = {
              _id: this.inventario._id,
              piezas: this.inventario.piezas,
              lotes: this.inventario.lotes,
              id_medicamento: this.inventario.id_medicamento._id,
            };

            const response = await updateInventario(
              this.inventario._id,
              inventarioUpdate
            );

            const response2 = await updateMedicamento(
              this.inventario.id_medicamento._id,
              this.inventario.id_medicamento
            );

            if (
              response.status == 200 &&
              response.data.acknowledged == true &&
              response2.status == 200 &&
              response2.data.acknowledged == true
            ) {
              Swal.fire({
                title: "Actualizado",
                text: "El inventario ha sido actualizado correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
              });
            } else {
              Swal.fire({
                title: "Error",
                text: "Ha ocurrido un error al actualizar el inventario",
                icon: "error",
                confirmButtonText: "Aceptar",
              });
            }
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.loading = true;
    if (typeof this.$route.params.id === "string") {
      this.loadInventario(this.$route.params.id);
    }
  },
});
</script>
