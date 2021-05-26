<template>
  <div class="send">
    <button class="send__files" @click.prevent="loadingFiles"></button>
    <input type="file" multiple class="send__img" @change="filesHandler" />
    <input
      type="text"
      placeholder="Message…"
      v-model="message"
      @keypress.enter="sending"
      class="send__input"
    />

    <button class="send__btn" @click.prevent="sending">
      <img src="../assets/paper-plane-outline.svg" alt="sending message" />
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "",
      files: [],
      openModal: false,
    };
  },

  methods: {
    sending() {
      this.$emit("sending", this.message);
      this.message = "";
    },
    loadingFiles(e) {
      let par = e.target.closest(".send");
      let inp = par.querySelector(".send__img");
      inp.click();
    },

    filesHandler(e) {
      if (!e.target.files.length) {
        return;
      }
      this.$store.dispatch("setOpenModal", true);
      this.$store.dispatch("setFiles", Array.from(e.target.files));
    },
  },
};
</script>

<style scoped>
.send {
  background-color: white;
  height: 4rem;
  border-radius: 30px;
  margin: 0 auto;
  width: 90%;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
  padding: 0 1rem;
  /* margin-bottom: 2rem; */
}

.send__img {
  display: none;
}

.send__files:before,
.send__files:after {
  --i: 0;
  content: "";
  position: absolute;
  height: 40%;
  width: 3px;
  background-color: #7c8c9f;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(calc(var(--i) * 90deg));
}

.send__files:after {
  --i: 1;
}

.send__files {
  position: relative;
}

.send__files,
.send__btn {
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  background-color: #f3f6ff;
  border: none;
  cursor: pointer;
}

.send__btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.send__btn img {
  width: 1.6rem;
  height: 1.6rem;
  filter: invert(25%) sepia(21%) saturate(6915%) hue-rotate(210deg)
    brightness(97%) contrast(89%);
}

.send__input {
  width: clamp(10rem, 80%, 40rem);
  height: 3rem;
  background: transparent;
  color: #7c8c9f;
  border: none;
  font-size: 1rem;
  padding-left: 0.5rem;
  margin: 0 0.2rem;
}

.send__input:focus,
.send__btn:focus,
.send__files:focus {
  outline: none;
}

.send__input:focus-visible,
.send__btn:focus-visible,
.send__files:focus-visible {
  outline: max(1px, 0.1em) solid currentColor;
  outline-offset: 0;
}

@media (max-width: 400px) {
  .send__input {
    width: clamp(30%, 43vw, 60%);
  }
}
</style>
