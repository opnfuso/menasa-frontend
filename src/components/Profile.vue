<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- TODO -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAuth, type Auth, type User } from "@firebase/auth";

export default defineComponent({
  name: "NavBar",
  data() {
    return {
      auth: {} as Auth,
      loading: true,
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
