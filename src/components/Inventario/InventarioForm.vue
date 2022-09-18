<!-- eslint-disable vue/no-unused-vars -->
<template>
  <main class="flex flex-col pt-6 pb-12 pr-12 pl-12" v-if="!loading">
    <form @submit.prevent="saveInventario()">
      <div class="grid grid-cols-7 gap-4">
        <h1 class="col-span-3 text-3xl font-bold mb-8">Inventario</h1>
        <button class="col-span-2 btn btn-success min-w-fit">Crear</button>
        <div @click="limpiar()" class="col-span-2 btn btn-error min-w-fit">
          Limpiar
        </div>
      </div>
      <!-- Información -->
      <div class="w-full rounded-xl bg-base-300 p-4 mb-8 shadow-2xl/40">
        <h2 class="text-2xl font-semibold mb-4">Información</h2>
        <div class="mb-4 grid grid-cols-1 gap-4">
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Medicamento</label>
            <Multiselect
              v-model="inventario.id_medicamento"
              @click="saveLocal()"
              :options="multiselect"
              :required="true"
              :searchable="true"
            />
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
              <label class="mb-2 font-semibold">Numero de Lote</label>
              <input
                @input="saveLocal()"
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
                @input="saveLocal()"
                type="date"
                class="input w-full"
                v-model="lote.fecha_vencimiento_string"
                required
              />
            </div>
            <div class="flex flex-col">
              <label for="date" class="mb-2 font-semibold"
                >Fecha de ingreso</label
              >
              <input
                @input="saveLocal()"
                type="date"
                class="input w-full"
                v-model="lote.fecha_ingreso_string"
                required
              />
            </div>
            <div class="flex flex-col">
              <label for="text" class="mb-2 font-semibold"
                >Cantidad de medicamento</label
              >
              <input
                @input="saveLocal()"
                type="number"
                class="input w-full"
                v-model="lote.cantidad"
                required
              />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Observaciones</label>
              <textarea
                @input="saveLocal()"
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
import Multiselect from "@vueform/multiselect";
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
      loading: true,
      multiselect: [] as any,
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
        this.medicamentos = response.data.filter((data) => {
          return data.hasInventory === false;
        });
        this.medicamentos.forEach((medicamento) => {
          if (
            medicamento.hasInventory === false &&
            medicamento.disabled === false
          ) {
            const newMultiselect = {
              value: medicamento._id,
              label: medicamento.nombre,
            };

            this.multiselect.push(newMultiselect);
          }

          this.multiselect = this.multiselect.sort((a, b) =>
            a.label.localeCompare(b.label)
          );
        });
      } catch (error) {
        console.error(error);
      }
    },

    addLote() {
      if (this.inventario.lotes === undefined) {
        this.inventario.lotes = [];
      }

      const item = {
        cantidad: 0,
        observaciones: "",
        fecha_ingreso: new Date(),
        fecha_vencimiento: new Date(),
        fecha_vencimiento_string: "",
        fecha_ingreso_string: "",
        lote: "",
      };

      this.inventario.lotes.splice(0, 0, item);
      this.saveLocal();
    },

    removeLote(index: number) {
      if (this.inventario.lotes) {
        this.inventario.lotes.splice(index, 1);
        if (this.inventario.lotes.length === 0) {
          delete this.inventario.lotes;
        }
      }
      this.saveLocal();
    },

    async saveInventario() {
      try {
        if (this.inventario.lotes === undefined) {
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

          this.inventario.lotes.forEach((lote) => {
            lote.fecha_vencimiento = new Date(lote.fecha_vencimiento_string);
            lote.fecha_ingreso = new Date(lote.fecha_ingreso_string);
          });

          const response = await createInventario(this.inventario, config);
          if (response.status === 201) {
            Swal.fire("Exito", "Inventario creado", "success").then(() => {
              this.inventario = {};
              this.saveLocal();
              this.$router.push("/inventario");
            });
          }
        }
      } catch (error) {
        Swal.fire("Error", "Error al crear inventario", "error");
        console.error(error);
      }
    },

    saveLocal() {
      if (typeof this.inventario.piezas === "string") {
        delete this.inventario.piezas;
      } else if (this.inventario.id_medicamento === null) {
        delete this.inventario.id_medicamento;
      }

      if (Object.keys(this.inventario).length === 0) {
        window.localStorage.removeItem("inventario");
      } else {
        window.localStorage.setItem(
          "inventario",
          JSON.stringify(this.inventario)
        );
      }
    },

    loadLocal() {
      if (window.localStorage.getItem("inventario") !== null) {
        this.inventario = JSON.parse(localStorage.getItem("inventario"));
      }
    },

    limpiar() {
      this.inventario = {};
      this.saveLocal();
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
        this.loadLocal();

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

<style src="@vueform/multiselect/themes/default.css"></style>
