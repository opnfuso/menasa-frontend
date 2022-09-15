<template>
  <div v-if="!loading" class="overflow-x-auto p-4">
    <div class="grid grid-cols-7 gap-4">
      <h1 class="col-span-4 text-3xl font-bold mb-8">Medicamentos</h1>
      <button @click="addMedicamento()" class="btn btn-primary min-w-fit">
        Añadir
      </button>
      <button @click="saveMedicamento()" class="btn btn-success min-w-fit">
        Guardar
      </button>
      <button class="btn btn-error w-full">Eliminar</button>
    </div>
    <div class="max-w-screen p-4">
      <input
        @keyup="keypress()"
        type="text"
        placeholder="Medicamento..."
        class="input input-bordered w-full"
        v-model="filter"
      />
    </div>
    <table class="table table-compact w-full">
      <thead>
        <tr>
          <th></th>
          <!-- <th>N:{{ Nmedicamentos }}</th> -->
          <!-- <th>U:{{ updateMeds }}</th> -->
          <th>Medicamento</th>
          <th>Precio</th>
          <th>Sal-Compuesto Activo</th>
          <th>Laboratorio</th>
          <th>Codigo de Barras</th>
        </tr>
      </thead>
      <!-- nuevos medicamentos -->
      <tbody v-for="(medicamento, index) in Nmedicamentos" :key="index">
        <tr>
          <td>
            <input
              v-model="chekedMeds"
              :value="index"
              type="checkbox"
              class="checkbox"
            />
          </td>
          <td>
            <input
              @click="modifiedNewValue(medicamento)"
              class="input w-full"
              type="text"
              required="true"
              v-model="medicamento.nombre"
            />
          </td>
          <td>
            <input
              @click="modifiedNewValue(medicamento)"
              class="input w-full"
              type="number"
              required="true"
              v-model="medicamento.precio"
            />
          </td>
          <td>
            <input
              @click="modifiedNewValue(medicamento)"
              class="input w-full"
              type="text"
              required="true"
              v-model="medicamento.compuesto_activo"
            />
          </td>
          <td>
            <input
              @click="modifiedNewValue(medicamento)"
              class="input w-full"
              type="text"
              required="true"
              v-model="medicamento.laboratorio"
            />
          </td>
          <td>
            <input
              @click="modifiedNewValue(medicamento)"
              class="input w-full"
              type="number"
              required="true"
              v-model="medicamento.codigo_barras"
            />
          </td>
        </tr>
      </tbody>
      <!-- medicamentos existentes -->
      <tbody v-for="(medicamento, index) in filteredMedicamentos" :key="index">
        <tr>
          <!-- <th>{{ index + 1 }}</th> -->
          <td>
            <input
              v-model="updateMeds"
              :value="medicamento"
              type="checkbox"
              class="checkbox"
            />
          </td>
          <td>
            <input
              @click="modifiedValue(medicamento)"
              class="input w-full"
              type="text"
              required="true"
              v-model="medicamento.nombre"
            />
          </td>
          <td>
            <input
              @click="modifiedValue(medicamento)"
              class="input w-full"
              type="number"
              required="true"
              v-model="medicamento.precio"
            />
          </td>
          <td>
            <input
              @click="modifiedValue(medicamento)"
              class="input w-full"
              type="text"
              required="true"
              v-model="medicamento.compuesto_activo"
            />
          </td>
          <td>
            <input
              @click="modifiedValue(medicamento)"
              class="input w-full"
              type="text"
              required="true"
              v-model="medicamento.laboratorio"
            />
          </td>
          <td>
            <input
              @click="modifiedValue(medicamento)"
              class="input w-full"
              type="number"
              required="true"
              v-model="medicamento.codigo_barras"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import type {
  Medicamento,
  MedicamentoCreate,
} from "@/interfaces/medicamento.interface";
import { getMedicamentos } from "@/services/medicamento.service";
import { createMedicamento } from "@/services/medicamento.service";
import { updateMedicamento } from "@/services/medicamento.service";
import { defineComponent } from "vue";
import { getAuth, type Auth, type User } from "@firebase/auth";
import Swal from "sweetalert2";
import { list } from "@firebase/storage";

export default defineComponent({
  name: "medicamento-list",
  data() {
    return {
      auth: {} as Auth,
      medicamentos: [] as Medicamento[],
      Nmedicamentos: [] as MedicamentoCreate[],
      Nmedicamento: {} as MedicamentoCreate,
      medicamento: {} as MedicamentoCreate,
      filteredMedicamentos: [] as Medicamento[],
      filter: "",
      chekedMeds: [] as MedicamentoCreate[],
      updateMeds: [] as Medicamento[],
      loading: true,
    };
  },
  methods: {
    async loadMedicamentos() {
      try {
        const token = await this.auth.currentUser?.getIdToken();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await getMedicamentos(config);
        this.medicamentos = response.data;
        this.filteredMedicamentos = this.medicamentos;
        this.ordeningMeds();
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
    async ordeningMeds() {
      try {
        this.medicamentos = this.medicamentos.sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        );
      } catch (error) {
        console.error(error);
      }
    },
    keypress() {
      this.filteredMedicamentos = this.medicamentos.filter((medicamentos) => {
        return medicamentos.nombre
          .toLowerCase()
          .includes(this.filter.toLowerCase());
      });
    },
    async addMedicamento() {
      try {
        if (this.Nmedicamento === undefined) {
          this.Nmedicamentos = [];
        }

        this.Nmedicamentos.push({
          codigo_barras: 0,
          precio: 0,
          nombre: "",
          compuesto_activo: "",
          laboratorio: "",
        });
        console.log(this.Nmedicamento);
        this.chekedMeds.push(this.Nmedicamento);
        console.log(this.chekedMeds);
      } catch (error) {
        Swal.fire("Error", "Error al crear el medicamento", "error");
        console.error(error);
      }
    },
    modifiedValue(medicamento: Medicamento) {
      if (this.updateMeds.indexOf(medicamento) == -1) {
        this.updateMeds.push(medicamento);
      }
    },
    modifiedNewValue(medicamento: Medicamento) {
      if (this.chekedMeds.indexOf(medicamento) == -1) {
        this.chekedMeds.push(medicamento);
      }
    },
    async saveMedicamento() {
      try{
        const token = await this.auth.currentUser?.getIdToken(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        if(this.updateMeds.length !== 0){
          this.updateMeds.forEach(async element => {
            console.log(element);
            await updateMedicamento(element._id,element,config);
          });
        }
        console.log(this.chekedMeds);
        this.chekedMeds.forEach(async element=>{
          console.log(JSON.stringify(element));
          await createMedicamento(element,config);
        });
      }catch(error){
        Swal.fire("Error", "Error al Guardar o Actualizar el/los medicamento/s", "error");
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
        this.loadMedicamentos();
        this.ordeningMeds();
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

// import type { Medicamento } from "@/interfaces/medicamento.interface";
// import { getMedicamentos } from "@/services/medicamento.service";
// import { createMedicamento } from "@/services/medicamento.service";
// import type { MedicamentoCreate } from "@/interfaces/medicamento.interface";
// import { getAuth, type Auth, type User } from "firebase/auth";
// import { defineComponent } from "vue";
// import Multiselect from "vue-multiselect";
// import Swal from "sweetalert2";

// export default defineComponent({
//   name: "medicamento-list",
//   data() {
//     return {
//       auth: {} as Auth,
//       loading: true,
//       medicamentos: [] as Medicamento[],
//       medicamento: {} as MedicamentoCreate,
//       modifieds: [] as number[],
//       value: null,
//       length: 0,
//       new_medicamentos: [] as number[],
//     };
//   },
//   methods: {
//     async loadMedicamentos() {
//       try {
//         const token = await this.auth.currentUser?.getIdToken(true);
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };
//         const response = await getMedicamentos(config);
//         this.medicamentos = response.data;
//       } catch (error) {
//         console.error(error);
//       }
//     },
//     async addMedicamento() {
//       try {
//         if (this.medicamento === undefined) {
//           this.medicamentos = [];
//         }

//         this.medicamentos.push({
//           _id: "",
//           codigo_barras: 0,
//           precio: 0,
//           nombre: "",
//           compuesto_activo: "",
//           laboratorio: "",
//         });

//         this.new_medicamentos.push(this.medicamentos.length - 1);
//         console.log(this.new_medicamentos);
//       } catch (error) {
//         Swal.fire("Error", "Error al crear el medicamento", "error");
//         console.error(error);
//       }
//     },
//     async saveMedicamento() {
//       try {
//         const token = await this.auth.currentUser?.getIdToken(true);
//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };
//         // if (this.value === null) {
//         //   Swal.fire({
//         //     title: "Error",
//         //     text: "Selecciona un medicamento",
//         //     icon: "error",
//         //   });
//         //   return;
//         // } else
//         if (this.medicamento === undefined) {
//           Swal.fire({
//             title: "Error",
//             text: "No se encuentra cambio aparente u agregacion",
//             icon: "error",
//           });
//         } else {
//           const auth = getAuth();
//           const token = await auth.currentUser?.getIdToken(true);
//           const config = {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           };
//           this.medicamentos.id_medicamento = this.value._id;
//           console.log(this.inventario);
//           const response = await createMedicamento(this.inventario, config);
//           if (response.status === 201) {
//             Swal.fire("Exito", "Medicamentos Guardados", "success");
//           }
//         }
//       } catch (error) {
//         Swal.fire("Error", "Error al guardar el/los medicamento/s", "error");
//         console.error(error);
//       }
//     },
//   },
//   mounted() {
//     const auth = getAuth();
//     new Promise<User>((resolve, reject) => {
//       const unsubscribe = auth.onAuthStateChanged(
//         (user) => {
//           if (user) {
//             unsubscribe();
//             resolve(user);
//           } else {
//             unsubscribe();
//             reject();
//           }
//         },
//         (error) => {
//           unsubscribe();
//           reject(error);
//         }
//       );
//     })
//       .then(async (user) => {
//         this.auth = auth;
//         this.loading = false;
//         this.loadMedicamentos();
//       })
//       .catch((error) => {
//         if (error) {
//           console.error(error);
//         } else {
//           this.$router.push("/login");
//         }
//       });
//   },
// });
</script>
