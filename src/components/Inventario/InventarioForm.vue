<!-- eslint-disable vue/no-unused-vars -->
<template>
  <main class="flex flex-col pt-6 pb-12 pr-12 pl-12" v-if="!loading">
    <form @submit.prevent="saveInventario()">
      <div class="grid grid-cols-4 gap-4">
        <h1 class="col-span-3 text-3xl font-bold mb-8">Inventario</h1>
        <button class="btn btn-success min-w-fit">Crear</button>
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
              required
            />
          </div>
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Medicamento</label>
            <multiselect
              v-model="medicamento"
              track-by="nombre"
              label="nombre"
              placeholder="Busca un medicamento"
              :options="medicamentos"
              :sercheable="true"
              :allow-empty="false"
            >
            </multiselect>
          </div>
        </div>
      </div>
      <!-- Lotes -->
      <div class="w-full rounded-xl bg-base-300 p-4 mb-8 shadow-2xl/40">
        <h2 class="text-2xl font-semibold mb-4">Lotes</h2>
        <div @click="addLote()" class="btn btn-info w-full">Añadir</div>
        <div class="divider"></div>
        <div v-for="(lote, index) in inventario.lotes" :key="index">
          <h3 class="text-xl mb-4 font-semibold">Lote</h3>
          <div class="mb-4 grid grid-cols-1 gap-4">
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Identificador</label>
              <input
                type="text"
                class="input w-full"
                v-model="lote.lote"
                required
              />
            </div>
            <div class="flex flex-col">
              <label for="date" class="mb-2 font-semibold"
                >Fecha de vencimiento</label
              >
              <input
                type="date"
                class="input w-full"
                v-model="lote.fecha_vencimiento"
                required
              />
            </div>
            <div class="flex flex-col">
              <label for="date" class="mb-2 font-semibold"
                >Fecha de ingreso</label
              >
              <input
                type="date"
                class="input w-full"
                v-model="lote.fecha_ingreso"
                required
              />
            </div>
            <div class="flex flex-col">
              <label for="text" class="mb-2 font-semibold"
                >Cantidad de medicamento</label
              >
              <input
                type="number"
                class="input w-full"
                v-model="lote.cantidad"
                required
              />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Observaciones</label>
              <textarea
                class="textarea textarea-bordered"
                v-model="lote.observaciones"
              ></textarea>
            </div>
            <div @click="removeLote(index)" class="btn btn-error w-full">
              Eliminar
            </div>
          </div>
          <div class="divider"></div>
        </div>
      </div>
    </form>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { InventarioCreate } from "@/interfaces/inventario.interface";
import type { Medicamento } from "@/interfaces/medicamento.interface";
import { getMedicamentos } from "@/services/medicamento.service";
import { createInventario } from "@/services/inventario.service";
import Multiselect from "vue-multiselect";
import Swal from "sweetalert2";
import { getAuth, type Auth, type User } from "firebase/auth";

export default defineComponent({
  name: "inventario-form",
  components: {
    Multiselect,
  },
  data() {
    return {
      auth: {} as Auth,
      inventario: {} as InventarioCreate,
      medicamentos: [] as Medicamento[],
      medicamento: null,
      loading: true,
    };
  },
  methods: {
    async listMedicamentos() {
      try {
        const token = await this.auth.currentUser?.getIdToken(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await getMedicamentos(config);
        this.loading = false;
        this.medicamentos = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    addLote() {
      if (this.inventario.lotes === undefined) {
        this.inventario.lotes = [];
      }

      this.inventario.lotes.push({
        cantidad: 0,
        observaciones: "",
        fecha_ingreso: new Date(),
        fecha_vencimiento: new Date(),
        fecha_vencimiento_string: "",
        fecha_ingreso_string: "",
        lote: "",
      });
    },

    removeLote(index: number) {
      this.inventario.lotes.splice(index, 1);
    },

    async saveInventario() {
      try {
        if (this.medicamento === null) {
          Swal.fire({
            title: "Error",
            text: "Selecciona un medicamento",
            icon: "error",
          });
          return;
        } else if (this.inventario.lotes === undefined) {
          Swal.fire({
            title: "Error",
            text: "Añade por lo menos un lote",
            icon: "error",
          });
        } else {
          const token = await this.auth.currentUser?.getIdToken(true);
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          this.inventario.id_medicamento = this.medicamento._id;
          console.log(this.inventario);
          const response = await createInventario(this.inventario, config);
          if (response.status === 201) {
            Swal.fire("Exito", "Inventario creado", "success");
          }
        }
      } catch (error) {
        Swal.fire("Error", "Error al crear inventario", "error");
        console.error(error);
      }
    },
  },
  async mounted() {
    const auth = getAuth();
    new Promise<User>((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(
        (user) => {
          if (user) {
            unsubscribe();
            resolve(user);
          } else {
            unsubscribe();
            reject();
          }
        },
        (error) => {
          unsubscribe();
          reject(error);
        }
      );
    })
      .then(async (user) => {
        this.auth = auth;
        this.loading = false;
        await this.listMedicamentos();
      })
      .catch((error) => {
        if (error) {
          console.error(error);
        } else {
          this.$router.push("/login");
        }
      });
  },
});
</script>
