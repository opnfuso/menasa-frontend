<template>
  <main class="flex flex-col pt-6 pb-12 pr-12 pl-12">
    <form>
      <div class="grid grid-cols-7 gap-4">
        <h1 class="col-span-3 text-3xl font-bold mb-8">Pedido</h1>
        <button class="col-span-2 btn btn-success min-w-fit">Crear</button>
        <div class="col-span-2 btn btn-error min-w-fit">Limpiar</div>
      </div>
      <!-- Información -->
      <div class="w-full rounded-xl bg-base-300 p-4 mb-8 shadow-2xl/40">
        <h2 class="text-2xl font-semibold mb-4">Información</h2>
        <div class="mb-4 grid grid-cols-1 gap-4">
          <div class="flex flex-col">
            <label for="text" class="mb-2 font-semibold">Cliente</label>
            <input type="text" class="input w-full" required />
          </div>
          <div class="flex flex-col">
            <label for="date" class="mb-2 font-semibold"
              >Fecha de entrada</label
            >
            <input type="date" class="input w-full" required />
          </div>
          <div class="flex flex-col">
            <label for="date" class="mb-2 font-semibold">Fecha de salida</label>
            <input type="date" class="input w-full" required />
          </div>
          <!-- <div class="flex flex-col">
            <label for="checkbox" class="mb-2 font-semibold">Completado</label>
            <input type="checkbox" class="checkbox checkbox-lg" />
          </div> -->
        </div>
      </div>
      <!-- Contenido -->
      <div class="w-full rounded-xl bg-base-300 p-4 mb-8 shadow-2xl/40">
        <h2 class="text-2xl font-semibold mb-4">Medicamentos</h2>
        <div class="btn btn-info w-full">Añadir</div>
        <div class="divider"></div>
        <div>
          <div class="mb-4 grid grid-cols-1 gap-4">
            <div class="mb-4 grid grid-cols-1 gap-4">
              <div class="flex flex-col">
                <label class="mb-2 font-semibold">Medicamento</label>
                <Multiselect
                  v-model="selectedMed"
                  @change="resetMultiselectLotes()"
                  @click="setMultiselectLotes(selectedMed)"
                  :options="multiselect"
                  :required="true"
                  :searchable="true"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Piezas</label>
              <input type="number" class="input w-full" required />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Precio maximo</label>
              <input
                type="number"
                class="input w-full"
                required
                v-model="selectedMed.id_medicamento.precio"
              />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Precio sugerido</label>
              <input type="number" class="input w-full" required />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Descuento</label>
              <input type="number" class="input w-full" required />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Precio total</label>
              <input type="number" class="input w-full" />
            </div>
            <div class="flex flex-col">
              <div class="grid grid-cols-7 gap-4">
                <label class="mb-2 font-semibold">Lote</label>
                <button class="col-span-2 btn-circle btn-accent min-w-fit">
                  Añadir
                </button>
              </div>
              <Multiselect
                :options="multiselectLotes"
                :required="true"
                :searchable="true"
              />
            </div>
            <div class="btn btn-error w-full">Eliminar</div>
          </div>
          <div class="divider"></div>
        </div>
      </div>
    </form>
  </main>
</template>

<script lang="ts">
import { getAuth, type Auth, type User } from "@firebase/auth";
import { defineComponent } from "vue";
import Multiselect from "@vueform/multiselect";
import type { Inventario } from "@/interfaces/inventario.interface";
import { getInventarios } from "@/services/inventario.service";

export default defineComponent({
  name: "pedido-form",
  components: {
    Multiselect,
  },
  data() {
    return {
      auth: {} as Auth,
      multiselect: [] as any,
      multiselectLotes: [] as any,
      selectedMed: {} as Inventario,
      inventarios: [] as Inventario[],
      inventarios_with_lotes: [] as Inventario[],
      filteredStock: [] as Inventario[],
      loading: true,
    };
  },
  methods: {
    async loadInventarios() {
      try {
        const token = await this.auth.currentUser?.getIdToken();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await getInventarios(config);
        this.inventarios = response.data;

        this.inventarios.forEach((inventario) => {
          if (
            inventario.id_medicamento.hasInventory === true &&
            inventario.id_medicamento.disabled == false &&
            inventario.lotes.length > 0
          ) {
            this.inventarios_with_lotes.push(inventario);
          }
        });
        this.ordeningInventario();
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
    async ordeningInventario() {
      try {
        this.filteredStock = this.inventarios_with_lotes.sort((a, b) =>
          a.id_medicamento.nombre.localeCompare(b.id_medicamento.nombre)
        );
        this.filteredStock.forEach((inventario) => {
          const newMultiselect = {
            value: inventario,
            label: inventario.id_medicamento.nombre,
          };
          this.multiselect.push(newMultiselect);
        });
        //console.log(this.filteredStock);
        console.log(this.filteredStock);
      } catch (error) {
        console.error(error);
      }
    },
    setMultiselectLotes(selectedMed: Inventario) {
      selectedMed.lotes.forEach((lote) => {
        const newMultiselectLote = {
          value: lote.lote,
          label: lote.lote + " " + lote.fecha_vencimiento,
        };
        this.multiselectLotes.push(newMultiselectLote);
      });
    },
    resetMultiselectLotes() {
      this.multiselectLotes.splice(0);
    },
  },
  mounted() {
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
        this.loadInventarios();
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
