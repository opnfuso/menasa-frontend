<template>
  <div v-if="!loading" class="overflow-x-auto p-4">
    <div class="grid grid-cols-3 gap-4">
      <h1 class="col-span-2 text-3xl font-bold mb-8">Medicamentos</h1>
    </div>
    <div class="max-w-screen p-4">
      <input
        @keyup="keypress()"
        type="text"
        placeholder="Medicamento..."
        class="input input-bordered w-full"
        v-model="filter"
      />
    </div>
    <table class="table table-compact w-full">
      <thead>
        <tr>
          <th>Medicamento</th>
          <th>Piezas</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody v-for="(inventarios, index) in stock" :key="index">
        <tr>
          <td>
            {{ inventarios.id_medicamento.nombre }}
          </td>
          <td>{{ inventarios.piezas }}</td>
          <td>
            {{ inventarios.id_medicamento.precio }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import type { Inventario } from "@/interfaces/inventario.interface";
import { getInventarios } from "@/services/inventario.service";
import { defineComponent } from "vue";
import { getAuth, type Auth, type User } from "@firebase/auth";
import { list } from "@firebase/storage";

export default defineComponent({
  name: "medicamento-list",
  data() {
    return {
      auth: {} as Auth,
      inventarios: [] as Inventario[],
      filteredStock: [] as Inventario[],
      stock: [] as Inventario[],
      filter: "",
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
        this.ordeningInventario();
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
    async ordeningInventario() {
      try {
        this.filteredStock = this.inventarios.sort((a, b) =>
          a.id_medicamento.nombre.localeCompare(b.id_medicamento.nombre)
        );
        this.filteredStock.forEach((inventario) => {
          if (inventario.piezas > 0) {
            this.stock.push(inventario);
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
    keypress() {
      this.filteredStock = this.inventarios.filter((inventarios) => {
        return inventarios.id_medicamento.nombre
          .toLowerCase()
          .includes(this.filter.toLowerCase());
      });
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
