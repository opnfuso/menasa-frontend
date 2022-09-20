<template>
  <main class="flex flex-col pt-6 pb-12 pr-12 pl-12">
    <form @submit.prevent="savePedido()">
      <div class="grid grid-cols-7 gap-4">
        <h1 class="col-span-3 text-3xl font-bold mb-8">Pedido</h1>
        <button class="col-span-2 btn btn-success min-w-fit">Actualizar</button>
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
              disabled
            />
          </div>
          <div class="flex flex-col">
            <label for="date" class="mb-2 font-semibold"
              >Fecha de entrada</label
            >
            <input
              type="date"
              class="input w-full"
              v-model="fecha_entrada_string"
              disabled
            />
          </div>
          <div class="flex flex-col">
            <label for="date" class="mb-2 font-semibold">Fecha de salida</label>
            <input
              type="date"
              class="input w-full"
              v-model="fecha_salida_string"
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
                  v-model="medicamentos"
                  @click="loadLotes(index)"
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
                v-model="pedido.medicamentos[index].precio_sugerido"
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
                v-model="pedido.medicamentos[index].precio_total"
                required
              />
            </div>
            <div class="flex flex-col">
              <div class="grid grid-cols-7 gap-4">
                <label class="mb-2 font-semibold">Lotes</label>
                <div class="btn btn-info w-full" @click="addLote(index)">
                  Añadir
                </div>
              </div>
              <div
                class="grid grid-cols-3 gap-8 mt-5"
                v-for="(lote, indexLote) in medicamento.inventario.lotes"
                :key="indexLote"
              >
                <Multiselect
                  @click="saveLote(index, indexLote)"
                  v-model="newLotes[indexLote]"
                  :options="multiselectLotes"
                  :required="true"
                  :searchable="true"
                />
                <input
                  v-model="lote.cantidad"
                  type="number"
                  class="input w-full"
                  required
                />
                <div
                  @click="deleteLote(index, indexLote)"
                  class="btn btn-error w-full"
                >
                  Eliminar
                </div>
              </div>
            </div>
            <div @click="deleteMedicamento(index)" class="btn btn-error w-full">
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
import { getAuth, type Auth, type User } from "@firebase/auth";
import { defineComponent } from "vue";
import Multiselect from "@vueform/multiselect";
import type { Pedido, PedidoCreate } from "@/interfaces/pedido.interface";
import { getPedido } from "@/services/pedidos.service";
import type { Inventario, Lote } from "@/interfaces/inventario.interface";

export default defineComponent({
  name: "pedido-detail",
  components: {
    Multiselect,
  },
  data() {
    return {
      auth: {} as Auth,
      pedido: {} as Pedido,
      loading: true,
      fecha_entrada_string: {} as string,
      fecha_salida_string: {} as string,

      multiselect: [] as any,
      multiselectLotes: [] as any,
      lotes: [] as Lote[],
      newLotes: [],
      inventario: {} as Inventario,
      inventarios: [] as Inventario[],
      inventarios_with_lotes: [] as Inventario[],
      filteredStock: [] as Inventario[],
      pedido: {} as PedidoCreate,
      medicamentos: null,
    };
  },
  methods: {
    async loadPedido(id: string) {
      try {
        const token = await this.auth.currentUser?.getIdToken(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await getPedido(id, config);
        this.loading = false;
        this.pedido = response.data;

        this.pedido.fecha_entrada = new Date(this.pedido.fecha_entrada);
        this.pedido.fecha_salida = new Date(this.pedido.fecha_salida);

        this.fecha_entrada_string = this.pedido.fecha_entrada
          .toISOString()
          .split("T")[0];
        this.fecha_salida_string = this.pedido.fecha_salida
          .toISOString()
          .split("T")[0];

        this.pedido.medicamentos.forEach((inventario) => {
          inventario.inventario.lotes.map((lote) => {
            const date = new Date(lote.fecha_vencimiento);
            const date2 = new Date(lote.fecha_ingreso);
            lote.fecha_vencimiento_string = date.toISOString().split("T")[0];
            lote.fecha_ingreso_string = date2.toISOString().split("T")[0];
          });
        });
        console.log(this.pedido);
      } catch (error) {
        console.error(error);
      }
    },
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
            inventario.lotes.length > 0 &&
            inventario.piezas > 0
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
      } catch (error) {
        console.error(error);
      }
    },
    loadLotes(index: number) {
      this.lotes = this.medicamentos.lotes;
      this.pedido.medicamentos[index].inventario = this.medicamentos;
      this.pedido.medicamentos[index].inventario.lotes = [];
      this.multiselectLotes = [];
      if (this.lotes.length > 0) {
        this.lotes.forEach((lote) => {
          const newMultiselectLote = {
            value: lote,
            label:
              lote.lote +
              " " +
              lote.fecha_vencimiento_string +
              "(" +
              lote.cantidad +
              ")",
          };
          this.multiselectLotes.push(newMultiselectLote);
        });
      }
    },
    async savePedido() {
      try {
        // console.log(this.pedido);
        const token = await this.auth.currentUser?.getIdToken(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await getInventarios(config);
        const inventarios = response.data;

        this.pedido.medicamentos.forEach(async (medicamento) => {
          const inventario = inventarios.find(
            (inventario) => inventario._id === medicamento.inventario._id
          );

          if (inventario) {
            medicamento.inventario.lotes.forEach((lote) => {
              inventario.lotes.find((lot) => lot.lote === lote.lote).cantidad -=
                lote.cantidad;
            });

            inventario.piezas -= medicamento.piezas;
            inventario.id_medicamento = inventario.id_medicamento._id;
            medicamento.id_inventario = inventario._id;

            const response = await updateInventario(
              inventario._id,
              inventario,
              config
            );
          }
        });

        this.pedido.fecha_entrada = new Date(this.pedido.fecha_entrada);
        if (this.pedido.fecha_salida) {
          this.pedido.fecha_salida = new Date(this.pedido.fecha_salida);
        }

        const response2 = await createPedido(this.pedido, config);

        if (response2.status === 201) {
          Swal.fire("Exito", "Pedido creado", "success").then(() => {
            this.pedido = {};
            this.$router.push("/pedido");
          });
        }
      } catch (error) {
        Swal.fire("Error", "Error al Guardar o Actualizar el pedido", "error");
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
          inventario: {
            _id: "",
            id_medicamento: {
              _id: "",
              codigo_barras: 0,
              precio: 0,
              nombre: "",
              compuesto_activo: "",
              laboratorio: "",
              disabled: false,
              hasInventory: false,
            },
            lotes: [],
            piezas: 0,
          },
          id_inventario: "",
        });
      } catch (error) {
        console.error(error);
      }
    },
    async addLote(index: number) {
      try {
        if (this.pedido.medicamentos[index].inventario.lotes === undefined) {
          this.pedido.medicamentos[index].inventario.lotes = [];
          this.newLotes = [null];

          this.pedido.medicamentos[index].inventario.lotes.push({
            fecha_vencimiento: new Date(),
            fecha_vencimiento_string: "",
            fecha_ingreso: new Date(),
            fecha_ingreso_string: "",
            cantidad: 0,
            lote: "",
            observaciones: "",
          });
        } else {
          this.pedido.medicamentos[index].inventario.lotes.push({
            fecha_vencimiento: new Date(),
            fecha_vencimiento_string: "",
            fecha_ingreso: new Date(),
            fecha_ingreso_string: "",
            cantidad: 0,
            lote: "",
            observaciones: "",
          });

          this.newLotes.push(null);
        }
      } catch (error) {
        console.error(error);
      }
    },
    deleteLote(index: number, indexLote: number) {
      this.newLotes.splice(indexLote, 1);
      this.pedido.medicamentos[index].inventario.lotes.splice(indexLote, 1);
    },
    deleteMedicamento(index: number) {
      this.pedido.medicamentos.splice(index, 1);
    },
    saveLote(index: number, indexLote: number) {
      this.pedido.medicamentos[index].inventario.lotes[indexLote] =
        this.newLotes[indexLote];
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
        if (typeof this.$route.params.id === "string") {
          this.loadInventarios();
          this.loadPedido(this.$route.params.id);
        }
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
