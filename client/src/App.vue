<template>
  <main>
    <router-view></router-view>
  </main>
</template>

<script>
export default {
  name: "App",

  created() {
    let user = localStorage.getItem("user");

    if (user) {
      user = JSON.parse(user);

      this.$store.dispatch("setUser", user);
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

main {
  height: 100vh;
  width: 100vw;
  display: grid;
  place-content: center;
  background-color: #2155bf;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    130deg,
    rgba(2, 112, 107, 1) 0%,
    rgba(33, 85, 191, 1) 35%,
    rgba(218, 0, 255, 1) 100%
  );
}

*::-webkit-scrollbar {
  width: 0.3em;
  height: 0.3em;
}

*::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

*::-webkit-scrollbar-thumb {
  background-color: #7c8c9f;
  outline: 1px solid slategrey;
}
</style>
