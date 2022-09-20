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
import type { Pedido } from "@/interfaces/pedido.interface";
import { getPedido } from "@/services/pedidos.service";

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
