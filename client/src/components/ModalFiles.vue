<template>
  <section class="modalContainer" v-if="isOpen">
    <div class="modalBack" v-if="isOpen" @click="closeModal"></div>
    <div class="modal" v-if="isOpen">
      <div class="modal__imgs">
        <div
          class="modal__img"
          v-for="img in imgs"
          :key="img.name"
          :data-name="img.name"
        >
          <div class="modal__img--delete" @click="removeImg">&times;</div>

          <img :src="img.url" :alt="img.name" />
        </div>
      </div>
      <div class="modal__btns">
        <button class="modal__cancel" @click.prevent="closeModal">
          Cancel
        </button>
        <button class="modal__upload">Upload</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ["isOpen", "files"],

  data() {
    return {
      imgs: [],
    };
  },
  created() {
    this.files.forEach((file) => {
      if (!file.type.match("image")) {
        return;
      }

      const reader = new FileReader();

      reader.onload = (ev) => {
        this.imgs.push({ url: ev.target.result, name: file.name });
      };

      reader.readAsDataURL(file);
    });
  },
  methods: {
    closeModal() {
      this.$emit("closeModal", false, []);
    },
    removeImg(e) {
      const name = e.target.closest(".modal__img").dataset.name;
      this.imgs = this.imgs.filter((img) => img.name !== name);

      if (this.imgs.length === 0) {
        this.$store.dispatch("setOpenModal", false);
        this.$store.dispatch("setFiles", []);
      }

      //this.$store.dispatch("setFiles", this.imgs);
    },
  },
};
</script>

<style>
.modalContainer {
  width: 100%;
  height: 100%;

  position: absolute;
}

.modalBack {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal {
  z-index: 6;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 360px;

  background-color: white;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  border-radius: 15px;
}

.modal__imgs {
  width: 310px;
  /* //height: 300px; */
  display: flex;
  flex-wrap: wrap;
  max-height: 300px;
  position: relative;
  overflow-y: auto;
}

.modal__img {
  flex: 1 1 30%;

  margin: 4px;
  position: relative;
}

.modal__img img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.modal__btns {
  margin-top: 1rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.modal__cancel,
.modal__upload {
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 12px;

  color: #040404;
  font-size: 1rem;
  box-shadow: 11px 8px 20px 0px rgb(34 60 80 / 13%);
  cursor: pointer;
  font-weight: bold;
  transition: all 0.5s ease;
}

.modal__cancel {
  background-color: #f26baa;
}

.modal__upload {
  background-color: #6bf26c;
}

.modal__upload:hover {
  background-color: #6bf26c90;
}
.modal__cancel:hover {
  background-color: #f26baa90;
}

.modal__img--delete {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  cursor: pointer;
}

@media (max-width: 420px) {
  .modal {
    width: 100%;
  }

  .modal__imgs {
    width: 100%;
  }

  .modal__img {
    flex: 1 1 47%;
  }
}
</style>
