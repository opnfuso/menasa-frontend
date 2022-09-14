<template>
  <div class="max-w-screen p-4">
    <input
      @keyup="keypress()"
      type="text"
      placeholder="Barra de busqueda por nombre de medicamento"
      class="input input-bordered w-full"
      v-model="filter"
    />
  </div>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4"
    v-if="!loading"
  >
    <router-link
      to="/inventario/new"
      class="btn btn-primary w-auto shadow-xl h-auto"
      >Añadir</router-link
    >
    <div
      class="card w-auto bg-base-100 shadow-xl"
      v-for="(usuario, index) in filteredUsuarios"
      :key="index"
    >
      <div class="card-body">
        <h2 class="card-title">Usuario # {{ index + 1 }}</h2>
        <p>Nombre: {{ usuario.displayName }}</p>
        <p>Email: {{ usuario.email }}</p>
        <div class="card-actions">
          <button
            class="btn btn-primary"
            @click="$router.push(`/users/${usuario.uid}`)"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { User } from "@/interfaces/user.interface";
import { defineComponent } from "vue";
import { getAuth, type Auth, type User as FUser } from "firebase/auth";
import { getUsers } from "@/services/user.service";

export default defineComponent({
  name: "inventario-list",
  data() {
    return {
      auth: {} as Auth,
      usuarios: [] as User[],
      filteredUsuarios: [] as User[],
      loading: true,
      filter: "",
    };
  },
  methods: {
    async loadUsuarios() {
      try {
        const token = await this.auth.currentUser?.getIdToken();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await getUsers(config);
        this.usuarios = response.data;
        this.filteredUsuarios = this.usuarios;
        this.ordeningData();
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
    async ordeningData() {
      try {
        this.usuarios = this.usuarios.sort((a, b) =>
          a.displayName.localeCompare(b.displayName)
        );
      } catch (error) {
        console.error(error);
      }
    },
    keypress() {
      this.filteredUsuarios = this.usuarios.filter((usuarios) => {
        return usuarios.displayName
          .toLowerCase()
          .includes(this.filter.toLowerCase());
      });
    },
  },
  mounted() {
    const auth = getAuth();
    new Promise<FUser>((resolve, reject) => {
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
        this.loadUsuarios();
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
