import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import routerInventario from "./router/inventario.router";

createApp(App).use(routerInventario).mount("#app");
