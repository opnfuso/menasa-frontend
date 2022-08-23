<template>
  <main class="bg-base-200 h-fit min-h-screen" data-theme="light">
    <NavBar />
    <router-view></router-view>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "./NavBar.vue";

export default defineComponent({
  name: "App",
  components: {
    NavBar,
  },
});
</script>

<style scoped></style>
