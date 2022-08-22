import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/inventario",
    name: "inventario",
    component: () => import("@/components/Inventario/InventarioList.vue"),
  },
  {
    path: "/inventario/new",
    name: "inventario-new",
    component: () => import("@/components/Inventario/InventarioForm.vue"),
  },
  {
    path: "/inventario/:id",
    name: "inventario-detail",
    component: () => import("@/components/Inventario/InventarioDetail.vue"),
  },
  {
    path: "/medicamento",
    name: "medicamento",
    component: () => import("@/components/Medicamento/MedicamentoList.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/LogIn.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
