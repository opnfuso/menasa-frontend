<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </label>
        <ul
          tabindex="0"
          class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li><router-link to="/inventario">Inventarios</router-link></li>
          <li><router-link to="/medicamento">Medicamentos</router-link></li>
          <li>
            <router-link to="/medicamento-inventario"
              >Stock Medicamentos</router-link
            >
          </li>
          <li>
            <router-link to="/inventario/faltante"
              >Medicamentos Faltantes</router-link
            >
          </li>
          <li><router-link to="/pedido">Pedidos</router-link></li>
          <li>
            <router-link to="/pedido/complete">Pedidos Completados</router-link>
          </li>
          <li><router-link to="/chat">Chat</router-link></li>
          <li v-if="isAdmin">
            <router-link to="/historial">Historial</router-link>
          </li>
          <li v-if="isAdmin">
            <router-link to="/users">Usuarios</router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="navbar-center">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/menasa-21c96.appspot.com/o/515d3b37-75e7-49b4-a088-317b5c752eee.jpg?alt=media&token=9bf5f0cd-bc0c-4a67-bec9-abf019257eff"
        alt="Logo"
        class="h-16"
      />
      <router-link to="/" class="btn btn-ghost normal-case text-xl"
        >Menasa</router-link
      >
    </div>
    <div class="navbar-end">
      <!-- <button class="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button> -->
      <router-link to="/chat" class="btn btn-ghost btn-circle">
        <router class="indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span
            v-if="$store.state.notification"
            class="badge badge-xs badge-primary indicator-item"
          ></span>
        </router>
      </router-link>
      <div v-if="!loading && auth.currentUser" class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img v-bind:src="auth.currentUser?.photoURL" />
          </div>
        </label>
        <ul
          tabindex="0"
          class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li><router-link to="/profile">Perfil</router-link></li>
          <li><button @click="signOut()">Cerrar Sesión</button></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAuth, type Auth, type User } from "@firebase/auth";
import { io, type Socket } from "socket.io-client";
import type { ReceiveMessage } from "@/interfaces/chat.interface";

export default defineComponent({
  name: "NavBar",
  data() {
    return {
      auth: {} as Auth,
      loading: true,
      socket: {} as Socket,
      isAdmin: false,
    };
  },
  methods: {
    async signOut() {
      await this.auth.signOut();
      this.$router.push("/login");
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

        const token = await auth.currentUser?.getIdTokenResult();

        if (token?.claims && token.claims.admin && !!token.claims.admin) {
          this.isAdmin = true;
        }

        this.socket = io(import.meta.env.VITE_API_URL);
        this.socket.connect();

        this.socket.on("broadcast", async (data: ReceiveMessage) => {
          if (!this.$store.state.chatFocus) {
            this.$store.commit("notificationTrue");
          } else {
            this.$store.commit("notificationFalse");
          }
        });
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
