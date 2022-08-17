<template>
  <div class="navbar bg-base-100 mb-6 shadow-xl">
    <div class="flex-1">
      <router-link to="/" class="btn btn-ghost normal-case text-xl"
        >Menasa</router-link
      >
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal p-0">
        <li><router-link to="/inventario">Inventario</router-link></li>
        <!-- <li><router-link>Item 2</router-link></li>
        <li><router-link>Item 3</router-link></li> -->
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NavBar",
});
</script>
