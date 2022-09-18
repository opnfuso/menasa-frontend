<template>
  <main class="flex flex-col pt-6 pb-12 pr-12 pl-12">
    <form>
      <div class="grid grid-cols-7 gap-4">
        <h1 class="col-span-3 text-3xl font-bold mb-8">Pedido</h1>
        <button
          class="col-span-2 btn btn-success min-w-fit"
          @click="savePedido()"
        >
          Crear
        </button>
        <div class="col-span-2 btn btn-error min-w-fit">Limpiar</div>
      </div>
      <!-- Información -->
      <div class="w-full rounded-xl bg-base-300 p-4 mb-8 shadow-2xl/40">
        <h2 class="text-2xl font-semibold mb-4">Información</h2>
        <div class="mb-4 grid grid-cols-1 gap-4">
          <div class="flex flex-col">
            <label for="text" class="mb-2 font-semibold">Cliente</label>
            <input
              type="text"
              class="input w-full"
              v-model="pedido.cliente"
              required
            />
          </div>
          <div class="flex flex-col">
            <label for="date" class="mb-2 font-semibold"
              >Fecha de entrada</label
            >
            <input
              type="date"
              class="input w-full"
              v-model="pedido.fecha_entrada"
              required
            />
          </div>
          <div class="flex flex-col">
            <label for="date" class="mb-2 font-semibold">Fecha de salida</label>
            <input
              type="date"
              class="input w-full"
              v-model="pedido.fecha_salida"
              required
            />
          </div>
        </div>
      </div>
      <!-- Contenido -->
      <div class="w-full rounded-xl bg-base-300 p-4 mb-8 shadow-2xl/40">
        <h2 class="text-2xl font-semibold mb-4">Medicamentos</h2>
        <div class="btn btn-info w-full" @click="addMedicamento()">Añadir</div>
        <div class="divider"></div>
        <div v-for="(medicamento, index) in pedido.medicamentos" :key="index">
          <div class="mb-4 grid grid-cols-1 gap-4">
            <div class="mb-4 grid grid-cols-1 gap-4">
              <div class="flex flex-col">
                <label class="mb-2 font-semibold">Medicamento</label>
                <Multiselect
                  @change="setMedicamento(index)"
                  :v-model="pedido.medicamentos[index].id_inventario"
                  :options="multiselect"
                  :required="true"
                  :searchable="true"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Piezas</label>
              <input
                type="number"
                class="input w-full"
                v-model="pedido.medicamentos[index].piezas"
                required
              />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Precio maximo</label>
              <input
                v-model="pedido.medicamentos[index].precio_maximo"
                type="number"
                class="input w-full"
                required
              />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Precio sugerido</label>
              <input
                @keyup="setDescuento(precio_sugerido)"
                v-model="pedido.medicamentos[index].precio_maximo"
                type="number"
                class="input w-full"
                required
              />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Descuento</label>
              <input
                v-model="pedido.medicamentos[index].descuento"
                type="number"
                class="input w-full"
                required
              />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Precio total</label>
              <input
                type="number"
                class="input w-full"
                v-model="pedido.medicamentos[index].precio_maximo"
                required
              />
            </div>
            <div class="flex flex-col">
              <div class="grid grid-cols-7 gap-4">
                <label class="mb-2 font-semibold">Lotes</label>
                <button class="col-span-2 btn-circle btn-primary min-w-fit">
                  Añadir
                </button>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <Multiselect
                  :options="multiselectLotes"
                  :required="true"
                  :searchable="true"
                />
                <input type="number" class="input w-full" required />
              </div>
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
import type {
  Inventario,
  InventarioCreate,
} from "@/interfaces/inventario.interface";
import { getInventarios } from "@/services/inventario.service";
import type { PedidoCreate } from "@/interfaces/pedido.interface";
import Swal from "sweetalert2";

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
      // lote_selected: {} as Inventario,
      inventarios: [] as Inventario[],
      inventarios_with_lotes: [] as Inventario[],
      filteredStock: [] as Inventario[],

      // descuento: {} as number,
      // precio_sugerido: {} as number,
      // precio_maximo: {} as number,
      // precio: {} as number,

      // newLotes: [] as InventarioCreate[],
      // newLote: {} as InventarioCreate,


      pedido: {} as PedidoCreate,
      medicamentos: {} as Inventario,
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
        console.log(this.filteredStock);
      } catch (error) {
        console.error(error);
      }
    },
    setMedicamento(index: number){
      console.log(this.pedido.medicamentos[index].id_inventario);
      console.log(this.multiselect);
    },
    // setMultiselectLotes(selectedMed: Inventario) {
    //   selectedMed.lotes.forEach((lote) => {
    //     const newMultiselectLote = {
    //       value: lote,
    //       label: lote.lote + " " + lote.fecha_vencimiento_string +"("+lote.cantidad+")",
    //     };
    //     this.multiselectLotes.push(newMultiselectLote);
    //   });
    //   this.precio = selectedMed.id_medicamento.precio;
    // },
    // setDescuento(precio_sugerido: number) {
    //   console.log(precio_sugerido);
    //   this.descuento = 100 - (precio_sugerido / this.precio) * 100;
    //   this.descuento = this.descuento.toFixed(0);
    //   console.log(this.descuento);
    // },
    // resetMultiselectLotes() {
    //   this.multiselectLotes.splice(0);
    // },
    // async addLote() {
    //   try {
    //     if (this.newLote === undefined) {
    //       this.newLotes = [];
    //     }
    //     this.newLotes.push({});
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },
    async savePedido() {
      try {
        const token = await this.auth.currentUser?.getIdToken(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        console.log(this.pedido);
      } catch (error) {
        Swal.fire(
          "Error",
          "Error al Guardar o Actualizar el/los medicamento/s",
          "error"
        );
        console.error(error);
      }
    },
    async addMedicamento() {
      try {
        if (this.pedido.medicamentos === undefined) {
          this.pedido.medicamentos = [];
        }
        this.pedido.medicamentos.push({
          piezas: 0,
          precio_maximo: 0,
          precio_sugerido: 0,
          descuento: 0,
          precio_total: 0,
          id_inventario: this.medicamentos,
        });
      } catch (error) {
        console.error(error);
      }
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

<style src="@vueform/multiselect/themes/default.css"></style>
