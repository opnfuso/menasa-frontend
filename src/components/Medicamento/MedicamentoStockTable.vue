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
      <tbody v-for="(medicamento, index) in filteredMedicamentos" :key="index">
        <tr>
          <td>
            {{ medicamento.nombre }}
          </td>
          <td>{{ inventarios.at(index)?.piezas }}</td>
          <td>
            {{ medicamento.precio }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import type { Medicamento } from "@/interfaces/medicamento.interface";
import type { Inventario } from "@/interfaces/inventario.interface";
import { getInventarios } from "@/services/inventario.service";
import { getMedicamentos } from "@/services/medicamento.service";
import { defineComponent } from "vue";
import { getAuth, type Auth, type User } from "@firebase/auth";
import { list } from "@firebase/storage";

export default defineComponent({
  name: "medicamento-list",
  data() {
    return {
      auth: {} as Auth,
      inventarios: [] as Inventario[],
      medicamentos: [] as Medicamento[],
      filteredMedicamentos: [] as Medicamento[],
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
    async loadMedicamentos() {
      try {
        const token = await this.auth.currentUser?.getIdToken();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await getMedicamentos(config);
        this.medicamentos = response.data;
        this.filteredMedicamentos = this.medicamentos;
        this.ordeningMeds();
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
    async ordeningMeds() {
      try {
        this.medicamentos = this.medicamentos.sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        );
      } catch (error) {
        console.error(error);
      }
    },
    async ordeningInventario() {
      try {
        this.inventarios = this.inventarios.sort((a, b) =>
          a.id_medicamento.nombre.localeCompare(b.id_medicamento.nombre)
        );
      } catch (error) {
        console.error(error);
      }
    },
    keypress() {
      this.filteredMedicamentos = this.medicamentos.filter((medicamentos) => {
        return medicamentos.nombre
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
        this.loadMedicamentos();
        this.ordeningInventario();
        this.ordeningMeds();
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
