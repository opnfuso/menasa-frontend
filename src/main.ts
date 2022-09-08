import { createApp } from "vue";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createStore } from "vuex";

import App from "./App.vue";
import "./index.css";
import router from "./router";

const store = createStore({
  state() {
    return {
      chatFocus: false,
    };
  },
  mutations: {
    false(state) {
      state.chatFocus = false;
    },

    true(state) {
      state.chatFocus = true;
    },
  },
});

const app = initializeApp({
  apiKey: import.meta.env.VITE_API_KEY,
  appId: import.meta.env.VITE_APP_ID,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
});
const analytics = getAnalytics(app);

createApp(App).use(router).use(store).mount("#app");
