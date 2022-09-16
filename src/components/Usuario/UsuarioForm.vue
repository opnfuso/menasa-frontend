<template>
  <main class="flex flex-col pt-6 pb-12 pr-12 pl-12" v-if="!loading">
    <form @submit.prevent="handleCreate()">
      <div class="grid grid-cols-4 gap-4">
        <h1 class="col-span-3 text-3xl font-bold mb-8">Usuario</h1>
        <button class="btn btn-success min-w-fit">Guardar</button>
      </div>
      <div class="w-full rounded-xl bg-base-300 p-4 mb-8 shadow-2xl/40">
        <h2 class="text-2xl font-semibold mb-4">Datos</h2>
        <div class="mb-4 grid grid-cols-1 gap-4">
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Nombre</label>
            <input
              type="text"
              class="input w-full"
              v-model="usuario.displayName"
              required
            />
          </div>
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Email</label>
            <input
              type="email"
              class="input w-full"
              v-model="usuario.email"
              required
            />
          </div>
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Telefono</label>
            <input
              type="text"
              class="input w-full"
              v-model="usuario.phoneNumber"
              required
            />
          </div>
          <div class="flex flex-col justify-start">
            <label class="mb-2 font-semibold">Es Admin</label>
            <input type="checkbox" class="checkbox" v-model="usuario.isAdmin" />
          </div>
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Foto de perfil</label>
            <input
              @change="previewImage($event)"
              class="input w-full mb-4 pt-1.5"
              type="file"
            />

            <img
              v-if="image.length > 0"
              v-bind:src="image"
              alt="Profile image"
              class="h-72 w-72"
            />
            <img
              v-else
              v-bind:src="usuario.photoURL"
              alt="Profile image"
              class="h-72 w-72"
            />
          </div>
        </div>
      </div>
    </form>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Swal from "sweetalert2";
import { getAuth, type Auth, type User as FUser } from "firebase/auth";
import { getApp, type FirebaseApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import type { UserCreate } from "@/interfaces/user.interface";

export default defineComponent({
  name: "inventario-detail",
  data() {
    return {
      auth: {} as Auth,
      usuario: {} as UserCreate,
      loading: true,
      image: "",
      imageObject: {} as File,
      app: {} as FirebaseApp,
      id: "",
    };
  },
  methods: {
    async handleCreate() {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Estás seguro de crear el perfil?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, crear",
        cancelButtonText: "No, cancelar",
      }).then(async (result) => {
        try {
          console.log(this.usuario);
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: "Error",
            text: "Ha ocurrido un error",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        }
      });
    },
    async previewImage($event: Event) {
      const target = $event.target as HTMLInputElement;
      if (target && target.files) {
        this.imageObject = target.files[0];
        this.image = URL.createObjectURL(target.files[0]);
      }
    },
    async uploadImage(image: File): Promise<string> {
      const storage = getStorage(this.app);

      const storageRef = ref(
        storage,
        import.meta.env.VITE_REF_STORAGE_USER + image.name
      );

      const res = await uploadBytes(storageRef, image).then(
        async (snapshot) => {
          const url = await getDownloadURL(snapshot.ref);

          return url;
        }
      );

      return res;
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
    this.app = getApp();

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
        await this.protectPage();
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
