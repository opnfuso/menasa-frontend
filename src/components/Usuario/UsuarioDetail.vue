<template>
  <main class="flex flex-col pt-6 pb-12 pr-12 pl-12" v-if="!loading">
    <form @submit.prevent="handleUpdate()">
      <div class="grid grid-cols-4 gap-4">
        <h1 class="col-span-3 text-3xl font-bold mb-8">Usuario</h1>
        <button class="btn btn-success min-w-fit">Guardar</button>
      </div>
      <!-- Medicamento -->
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
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Foto de perfil</label>
            <!-- <div @click="previewImage()" class="btn btn-info max-w-fit mb-4">
              Elegir imagen
            </div> -->

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
import { getAuth, type Auth, type User } from "firebase/auth";
import { getUser } from "@/services/user.service";
import type { InventarioUpdate } from "@/interfaces/inventario.interface";
import { updateInventario } from "@/services/inventario.service";
import { updateMedicamento } from "@/services/medicamento.service";
import { getApp, type FirebaseApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export default defineComponent({
  name: "inventario-detail",
  data() {
    return {
      auth: {} as Auth,
      usuario: {} as User,
      loading: true,
      image: "",
      imageObject: {} as File,
      app: {} as FirebaseApp,
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
      } catch (error) {
        console.error(error);
      }
    },
    async handleUpdate() {
      try {
        Swal.fire({
          title: "¿Estás seguro?",
          text: "¿Estás seguro de actualizar el inventario?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, actualizar",
          cancelButtonText: "No, cancelar",
        }).then(async (result) => {
          if (result.value) {
            this.inventario.lotes.forEach((lote) => {
              lote.fecha_vencimiento = new Date(lote.fecha_vencimiento_string);
              lote.fecha_ingreso = new Date(lote.fecha_ingreso_string);
            });

            const inventarioUpdate: InventarioUpdate = {
              _id: this.inventario._id,
              piezas: this.inventario.piezas,
              lotes: this.inventario.lotes,
              id_medicamento: this.inventario.id_medicamento._id,
            };
            const token = await this.auth.currentUser?.getIdToken(true);
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };

            const response = await updateInventario(
              this.inventario._id,
              inventarioUpdate,
              config
            );

            const response2 = await updateMedicamento(
              this.inventario.id_medicamento._id,
              this.inventario.id_medicamento,
              config
            );

            if (
              response.status == 200 &&
              response.data.acknowledged == true &&
              response2.status == 200 &&
              response2.data.acknowledged == true
            ) {
              Swal.fire({
                title: "Actualizado",
                text: "El inventario ha sido actualizado correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
              });
            } else {
              Swal.fire({
                title: "Error",
                text: "Ha ocurrido un error al actualizar el inventario",
                icon: "error",
                confirmButtonText: "Aceptar",
              });
            }
          }
        });
      } catch (error) {
        console.error(error);
      }
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
  },
  mounted() {
    const auth = getAuth();
    this.app = getApp();

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
        if (typeof this.$route.params.id === "string") {
          this.loadUsuario(this.$route.params.id);
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
