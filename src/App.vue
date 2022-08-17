<template>
  <html class="white">
    <NavBar />
  </html>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "./Nav-bar.vue";

export default defineComponent({
  name: "App",
  components: {
    NavBar,
  },
});
</script>

<style scoped></style>
