import { Component } from "@firebase/component";
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
    path: "/medicamento-inventario",
    name: "Stock Medicamentos",
    component: () =>
      import("@/components/Medicamento/MedicamentoStockTable.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/components/LogIn.vue"),
  },
  {
    path: "/chat",
    name: "chat",
    component: () => import("@/components/Chat.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/components/Profile.vue"),
  },
  {
    path: "/users",
    name: "users",
    component: () => import("@/components/Usuario/UsuarioList.vue"),
  },
  {
    path: "/users/:id",
    name: "users-detail",
    component: () => import("@/components/Usuario/UsuarioDetail.vue"),
  },
  {
    path: "/user/new",
    name: "user-new",
    component: () => import("@/components/Usuario/UsuarioForm.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
