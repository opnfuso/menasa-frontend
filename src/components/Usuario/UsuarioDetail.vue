<template>
  <main class="flex flex-col pt-6 pb-12 pr-12 pl-12" v-if="!loading">
    <form @submit.prevent="handleUpdate()">
      <div class="grid grid-cols-4 gap-4">
        <h1 class="col-span-2 text-3xl font-bold mb-8">Usuario</h1>
        <button class="btn btn-success min-w-fit">Guardar</button>
        <div @click="handleDelete()" class="btn btn-error min-w-fit">
          Eliminar
        </div>
      </div>
      <div class="w-full rounded-xl bg-base-300 p-4 mb-8 shadow-2xl/40">
        <h2 class="text-2xl font-semibold mb-4">Datos</h2>
        <div class="mb-4 grid grid-cols-1 gap-4">
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Nombre</label>
            <input
              type="text"
              class="input w-full"
              v-model="userUpdate.displayName"
              required
            />
          </div>
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Email</label>
            <input
              type="email"
              class="input w-full"
              v-model="userUpdate.email"
              required
            />
          </div>
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Telefono</label>
            <input
              type="text"
              class="input w-full"
              v-model="userUpdate.phoneNumber"
              required
            />
          </div>
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Nueva contraseña</label>
            <input
              type="password"
              class="input w-full"
              v-model="userUpdate.password"
              required
            />
          </div>
          <div class="flex flex-col justify-start">
            <label class="mb-2 font-semibold">Es Admin</label>
            <input
              type="checkbox"
              class="checkbox"
              v-model="userUpdate.isAdmin"
            />
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
import { getUser, updateUser, deleteUser } from "@/services/user.service";
import { getApp, type FirebaseApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import type { User, UserUpdate } from "@/interfaces/user.interface";
import { nanoid } from "nanoid";

export default defineComponent({
  name: "inventario-detail",
  data() {
    return {
      auth: {} as Auth,
      usuario: {} as User,
      userUpdate: {} as UserUpdate,
      loading: true,
      image: "",
      imageObject: {} as File,
      app: {} as FirebaseApp,
      id: "",
    };
  },
  methods: {
    async loadUsuario(id: string) {
      try {
        const token = await this.auth.currentUser?.getIdToken(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await getUser(id, config);
        this.loading = false;
        this.usuario = response.data;
        this.userUpdate = this.usuario;
        this.userUpdate.isAdmin = this.usuario.customClaims.admin;
      } catch (error) {
        console.error(error);
      }
    },
    async handleUpdate() {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Estás seguro de actualizar el usuario?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, actualizar",
        cancelButtonText: "No, cancelar",
      }).then(async (result) => {
        try {
          if (result.value) {
            const userUpdate: UserUpdate = {
              uid: this.userUpdate.uid,
              email: this.userUpdate.email,
              displayName: this.userUpdate.displayName,
              phoneNumber: this.userUpdate.phoneNumber,
              isAdmin: this.userUpdate.isAdmin,
              password: this.userUpdate.password,
            };

            if (this.imageObject.size > 0) {
              const photoURL = await this.uploadImage(this.imageObject);

              userUpdate.photoURL = photoURL;
            }

            const token = await this.auth.currentUser?.getIdToken(true);
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };

            if (this.auth.currentUser && this.auth.currentUser.uid) {
              const response = await updateUser(
                this.auth.currentUser.uid,
                userUpdate,
                config
              );

              if (response.status === 200) {
                Swal.fire({
                  title: "Actualizado",
                  text: "El usuario ha sido actualizado correctamente",
                  icon: "success",
                  confirmButtonText: "Aceptar",
                });
              }
            }
          }
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
        import.meta.env.VITE_REF_STORAGE_USER +
          nanoid(36) +
          "." +
          this.imageObject.name.split(".").pop()
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
    async handleDelete() {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Estás seguro de eliminar el usuario?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "No, cancelar",
      }).then(async (result) => {
        try {
          if (result.value) {
            const token = await this.auth.currentUser?.getIdToken(true);
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };

            if (this.auth.currentUser && this.auth.currentUser.uid) {
              const response = await deleteUser(this.id, config);

              if (response.status === 200) {
                Swal.fire({
                  title: "Actualizado",
                  text: "El usuario ha sido eliminado correctamente",
                  icon: "success",
                  confirmButtonText: "Aceptar",
                });
              }
            }
          }
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
        await this.protectPage();
        this.loading = false;
        if (typeof this.$route.params.id === "string") {
          this.id = this.$route.params.id;
          this.loadUsuario(this.id);
        }
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
