<template>
  <div class="navbar bg-base-100 mb-6 shadow-xl">
    <div class="dropdown">
      <label tabindex="0" class="btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
      </label>
      <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
        <li><router-link to="/inventario">Inventario</router-link></li>
        <li><router-link to="/lista-precios">Lista de Precios</router-link></li>
      </ul>
    </div>
    <div class="flex-1">
      <router-link to="/" class="btn btn-ghost normal-case text-xl"
        >Menasa</router-link
      >
    </div>
    
  
  </div>

</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NavBar",
});
</script>
