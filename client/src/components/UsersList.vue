<template>
  <aside :class="{ aside: show }">
    <h2 class="users__head">
      Chat With
      <div @click="exit" class="exit" :class="{ aside: show }">
        <div class="exit__inner"></div>
      </div>
    </h2>

    <router-link class="user" v-if="$route.path !== '/'" to="/">
      <div
        class="user__avatar"
        :style="{
          'background-color': '#f26baa',
        }"
      >
        <img src="../assets/arrow-back-outline.svg" alt="arrow" />
      </div>
      <div class="user__name">Back to group chat</div>
    </router-link>

    <router-link
      class="user"
      v-for="user in users"
      :key="user._id"
      :to="user.to"
      :data-id="user._id"
      @click="setCompanion"
    >
      <div
        class="user__avatar"
        :style="{
          'background-color': user.avatar,
        }"
      >
        <div class="user__text">
          {{ user.name[0] }}
        </div>
      </div>
      <div class="user__name">{{ user.name }}</div>
    </router-link>
  </aside>
</template>

<script>
export default {
  props: ["users", "show"],

  methods: {
    setCompanion(e) {
      const id = e.currentTarget.dataset.id;
      const comp = this.users.filter((el) => el._id === id);

      localStorage.setItem("companion", JSON.stringify(comp[0]));

      this.$store.dispatch("setCompanion", comp[0]);
    },
    exit() {
      this.$emit("exit", false);
    },
  },

  computed: {
    getUser() {
      return this.$store.getters["getUser"];
    },
    // getUsers() {
    //   return this.users.filter((el) => el._id !== this.getUser.id);
    // },
  },
};
</script>

<style scoped>
aside {
  height: 90%;
  width: clamp(12rem, 25vw, 20rem);
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  overflow-y: auto;
  max-width: 100%;
  margin: auto 0;
  margin-left: 2rem;
  box-shadow: 20px 20px 20px 0px rgb(34 60 80 / 5%);
}

.user {
  display: flex;
  align-items: center;
  gap: 1rem;

  padding: 1rem 0;
  transition: color 0.5s ease;
  text-decoration: none;
  color: #000;
}

.router-link-exact-active {
  border-left: 4px solid #f26baa;
  background-color: #f3f6ff;
}

.user:hover:not(.user--active) {
  background-color: #f3f6ff52;
}

.user:not(:last-child) {
  border-bottom: 1px solid #f3f6ff;
}

.user__avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin-left: 1rem;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.user__avatar img {
  transform: scale(0.6);
}

.user__text {
  color: white;
  mix-blend-mode: difference;
}

.users__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 1rem 2rem 1rem;
}

.user__name {
  white-space: nowrap;
  overflow: hidden;

  text-overflow: ellipsis;
  max-width: clamp(6rem, 17vw, 15rem);
}

.aside {
  display: block;
  transform-origin: left;
  animation: moveIn 0.5s ease forwards;
}

@keyframes moveIn {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

.exit {
  width: 40px;
  height: 24px;
  position: relative;
}

.exit__inner {
  transform: rotate(45deg);
}

.exit__inner:before,
.exit__inner:after {
  position: absolute;
  content: "";
  width: 40px;
  height: 4px;
  border-radius: 4px;
  background-color: #000;
}

.exit__inner:after {
  transform: rotate(-90deg);
}
/* .exit__inner:before {
  transform: rotate(45deg);
} */

@media (max-width: 1050px) {
  .user__name {
    max-width: clamp(6rem, 14vw, 15rem);
  }
}

@media (max-width: 800px) {
  aside {
    position: absolute;

    left: 0;
    z-index: 3;
    top: 0;

    width: clamp(23rem, 27vw, 20rem);
    margin: 0;
    height: 100%;
    display: none;
  }

  .exit {
    display: none;
  }

  .exit.aside {
    display: block;
  }
}

@media (max-width: 550px) {
  aside {
    width: 100%;
  }
}

@media (min-width: 801px) {
  .exit {
    display: none;
  }
}
</style>
