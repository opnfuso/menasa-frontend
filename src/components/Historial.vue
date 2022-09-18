<template>
  <div v-if="!loading" class="overflow-x-auto p-4">
    <div class="grid grid-cols-7 gap-4">
      <h1 class="col-span-3 text-3xl font-bold mb-8">Historial</h1>
    </div>
    <table class="table table-compact w-full">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Acción</th>
          <th>Fecha</th>
          <th>Categoría</th>
          <th>Objeto afectado</th>
        </tr>
      </thead>
      <tbody v-for="(historial, index) in historials" :key="index">
        <tr>
          <td>
            <input
              v-model="historial.userId"
              type="text"
              class="input w-full"
              disabled
            />
          </td>
          <td>
            <input
              v-model="historial.action"
              class="input w-full"
              type="text"
              disabled
            />
          </td>
          <td>
            <input
              v-model="historial.createdAtString"
              type="date"
              class="input input-bordered w-full"
              disabled
            />
          </td>
          <td>
            <input
              v-model="historial.category"
              class="input w-full"
              type="text"
              disabled
            />
          </td>
          <td>
            <input
              v-if="
                historial.category === 'inventario' && historial.id_inventario
              "
              v-model="historial.id_inventario._id"
              class="input w-full"
              type="text"
              disabled
            />
            <input
              v-else-if="historial.category === 'pedido' && historial.id_pedido"
              v-model="historial.id_pedido._id"
              class="input w-full"
              type="text"
              disabled
            />
            <input
              v-else-if="
                historial.category === 'medicamento' && historial.id_medicamento
              "
              v-model="historial.id_medicamento._id"
              class="input w-full"
              type="text"
              disabled
            />
            <input
              v-else-if="historial.category === 'user'"
              v-model="historial.id_user"
              class="input w-full"
              type="text"
              disabled
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAuth, type Auth, type User } from "@firebase/auth";
import Swal from "sweetalert2";
import { getHistorial } from "@/services/historial.service";
import type { Historial } from "@/interfaces/historial.interface";

export default defineComponent({
  name: "medicamento-list",
  data() {
    return {
      auth: {} as Auth,
      historials: [] as Historial[],
      filter: "",
      loading: true,
    };
  },
  methods: {
    async loadHistorial() {
      try {
        const token = await this.auth.currentUser?.getIdToken();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await getHistorial(config);
        this.historials = response.data;

        this.historials.forEach((historial) => {
          historial.createdAt = new Date(historial.createdAt);
          historial.createdAtString = historial.createdAt
            .toISOString()
            .split("T")[0];
        });

        this.ordeningHistorial();

        console.log(this.historials);

        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
    async ordeningHistorial() {
      try {
        this.historials = this.historials.sort((a, b) => {
          return Number(a.createdAt) - Number(b.createdAt);
        });
      } catch (error) {
        console.error(error);
      }
    },
    async protectPage() {
      const claims = await this.auth.currentUser?.getIdTokenResult();
      const admin = claims?.claims.admin;

      if (admin === undefined) {
        this.$router.push("/");
      } else if (typeof admin === "boolean" && admin === false) {
        this.$router.push("/");
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
        // await this.protectPage();
        this.auth = auth;
        this.loading = false;
        await this.loadHistorial();
        this.ordeningHistorial();
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
