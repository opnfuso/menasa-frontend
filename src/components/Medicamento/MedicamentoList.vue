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
      <button @click="deleteMedicamentos()" class="btn btn-error w-full">
        Eliminar
      </button>
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
  MedicamentoUpdate,
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
        this.medicamentos.forEach((medicamento) => {
          if (medicamento.disabled === false) {
            this.filteredMedicamentos.push(medicamento);
          }
        });
        this.ordeningMeds();
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
    async ordeningMeds() {
      try {
        this.filteredMedicamentos = this.medicamentos.sort((a, b) =>
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
      try {
        const token = await this.auth.currentUser?.getIdToken(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        let flag = false;
        if (this.updateMeds.length !== 0) {
          this.updateMeds.forEach(async (element) => {
            console.log(element);
            const response = await updateMedicamento(
              element._id,
              element,
              config
            );
            if (response.status !== 200) {
              flag = true;
            }
          });
        }
        console.log(this.chekedMeds);
        this.chekedMeds.forEach(async (element) => {
          const response = await createMedicamento(element, config);
          if (response.status !== 201) {
            flag = true;
          }
        });
        if (flag === false) {
          Swal.fire(
            "Exito",
            "Medicamentos Guardados y/o Actualizados",
            "success"
          );
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "Error al Guardar o Actualizar el/los medicamento/s",
          "error"
        );
        console.error(error);
      }
    },
    async deleteMedicamentos() {
      try {
        const token = await this.auth.currentUser?.getIdToken(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        let flag = false;

        this.updateMeds.forEach(async (medicamento) => {
          const disableMedicamento: MedicamentoUpdate = this.medicamento;
          disableMedicamento.disabled = true;
          const response = await updateMedicamento(
            medicamento._id,
            disableMedicamento,
            config
          );

          if (response.status !== 200) {
            flag = true;
          }

          if (flag === false) {
            Swal.fire("Exito", "Medicamentos Eliminados", "success");
          }
        });
      } catch (error) {
        console.error(error);
        Swal.fire(
          "Error",
          "Error al Guardar o Actualizar el/los medicamento/s",
          "error"
        );
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
</script>
