import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createStore } from "vuex";

import App from "./App.vue";

import ChatPage from "./pages/ChatPage.vue";
import LoginPage from "./pages/LoginPage.vue";

const router = new createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: ChatPage,
      meta: { requiresAuth: true },
    },

    {
      path: "/chat/:id",
      component: ChatPage,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/auth",
      component: LoginPage,
      meta: { requiresUnauth: true },
    },
  ],
});

router.beforeEach((to, _, next) => {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next("/auth");
  } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

const store = createStore({
  state() {
    return {
      user: null,
      companion: null,
      files: [],
      openModal: false,
    };
  },

  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setCompanion(state, payload) {
      state.companion = payload;
    },

    setOpenModal(state, payload) {
      state.openModal = payload;
    },
    setFiles(state, payload) {
      state.files = payload;
    },
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getCompanion(state) {
      return state.companion;
    },
    isAuthenticated(state) {
      return !!state.user;
    },
    isModalOpen(state) {
      return state.openModal;
    },

    getFiles(state) {
      return state.files;
    },
  },
  actions: {
    setUser(context, payload) {
      context.commit("setUser", {
        name: payload.name,
        avatar: payload.avatar,
        id: payload._id,
        email: payload.email,
        password: payload.password,
      });
    },
    setCompanion(context, payload) {
      context.commit("setCompanion", {
        name: payload.name,
        avatar: payload.avatar,
        id: payload._id,
        email: payload.email,
        password: payload.password,
      });
    },

    setOpenModal(context, payload) {
      context.commit("setOpenModal", payload);
    },
    setFiles(context, payload) {
      context.commit("setFiles", payload);
    },

    logout(context, payload) {
      context.commit("setUser", payload);
    },
  },
});

const app = createApp(App);

app.use(router);

app.use(store);

app.mount("#app");
