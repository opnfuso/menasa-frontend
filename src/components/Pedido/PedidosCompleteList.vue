<template>
  <div class="max-w-screen p-4">
    <input
      @keyup="keypress()"
      type="text"
      placeholder="Cliente..."
      class="input input-bordered w-full"
      v-model="filter"
    />
  </div>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4"
    v-if="!loading"
  >
    <div
      class="card w-auto bg-base-100 shadow-xl"
      v-for="(pedido, index) in filteredPedidos"
      :key="index"
    >
      <div class="card-body">
        <h2 class="card-title">Pedido # {{ index + 1 }}</h2>
        <p>Cliente: {{ pedido.cliente }}</p>
        <p>
          Fecha de Entrada:
          {{ pedido.fecha_entrada.toISOString().split("T")[0] }}
        </p>
        <p v-if="pedido.fecha_salida < pedido.fecha_entrada">
          Fecha de salida:Pendiente
        </p>
        <p v-else>
          Fecha de salida:{{ pedido.fecha_salida.toISOString().split("T")[0] }}
        </p>
        <div class="card-actions">
          <button
            class="btn btn-primary"
            @click="$router.push(`/pedido/complete/${pedido._id}`)"
          >
            Ver
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAuth, type Auth, type User } from "firebase/auth";
import type { Pedido } from "@/interfaces/pedido.interface";
import { getPedidos } from "@/services/pedidos.service";

export default defineComponent({
  name: "pedidolist-list",
  data() {
    return {
      auth: {} as Auth,
      pedidos: [] as Pedido[],
      filteredPedidos: [] as Pedido[],
      loading: true,
      filter: "",
    };
  },
  methods: {
    async loadPedidos() {
      try {
        const token = await this.auth.currentUser?.getIdToken();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await getPedidos(config);
        this.pedidos = response.data.filter((data) => {
          return data.completado === true;
        });

        this.pedidos.forEach((pedido) => {
          pedido.fecha_entrada = new Date(pedido.fecha_entrada);
          pedido.fecha_salida = new Date(pedido.fecha_salida);
        });

        this.filteredPedidos = this.pedidos;
        this.ordeningData();
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
    keypress() {
      this.filteredPedidos = this.pedidos.filter((pedidos) => {
        return pedidos.cliente
          .toLowerCase()
          .includes(this.filter.toLowerCase());
      });
    },
    async ordeningData() {
      try {
        this.pedidos = this.pedidos.sort(
          (a, b) => Number(b.fecha_salida) - Number(a.fecha_salida)
        );
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
        this.loadPedidos();
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
