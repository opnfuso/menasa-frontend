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
            <div class="link">
              <router-link :to="`/users/${historial.userId}`">{{
                historial.userId.displayName
              }}</router-link>
            </div>
          </td>
          <td>
            <div>{{ historial.action }}</div>
          </td>
          <td>
            <div>{{ historial.createdAt.toLocaleString() }}</div>
          </td>
          <td>
            <div>{{ historial.category }}</div>
          </td>
          <td>
            <div
              v-if="
                historial.id_inventario === null ||
                historial.id_medicamento === null ||
                historial.id_pedido === null ||
                historial.id_user === null
              "
            >
              Eliminado
            </div>
            <div
              v-else-if="
                historial.category === 'inventario' && historial.id_inventario
              "
              class="link"
            >
              <router-link :to="`/inventario/${historial.id_inventario._id}`">{{
                historial.id_inventario._id
              }}</router-link>
            </div>
            <div
              v-else-if="historial.category === 'pedido' && historial.id_pedido"
              class="link"
            >
              <router-link :to="`/pedido/${historial.id_pedido._id}`">{{
                historial.id_pedido._id
              }}</router-link>
            </div>
            <div
              v-else-if="
                historial.category === 'medicamento' && historial.id_medicamento
              "
              class="link"
            >
              <router-link :to="`/medicamento`">{{
                historial.id_medicamento._id
              }}</router-link>
            </div>
            <div v-else-if="historial.category === 'user'" class="link">
              <router-link :to="`/users/${historial.id_user}`">{{
                historial.id_user
              }}</router-link>
            </div>
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
import { getUsers } from "@/services/user.service";

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

        const response2 = await getUsers(config);
        const users = response2.data;

        this.historials.forEach((historial) => {
          historial.createdAt = new Date(historial.createdAt);
          const uid = historial.userId;
          const usr = users.find((user) => user.uid === uid);

          if (usr) {
            historial.userId = usr;
          }
        });

        this.ordeningHistorial();

        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
    async ordeningHistorial() {
      try {
        this.historials = this.historials.sort((a, b) => {
          return Number(b.createdAt) - Number(a.createdAt);
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
