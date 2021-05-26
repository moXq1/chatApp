<template>
  <div v-if="id === getUser.id" class="message-container">
    <div class="mes">
      <slot></slot>
      <div class="time">{{ publishTime }}</div>
    </div>
    <div class="avt" :style="{ backgroundColor: getUser.avatar }">
      <div class="avt__text">{{ getUser.name[0] }}</div>
    </div>
  </div>
  <div v-else class="message-container message-container--companion">
    <div class="mes--companion">
      <slot></slot>
      <div class="time">{{ publishTime }}</div>
    </div>
    <div class="avt" :style="{ backgroundColor: getCompanion.avatar }">
      <div class="avt__text">{{ getCompanion.name[0] }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id", "date"],

  data() {
    return {
      now: null,
    };
  },
  created() {
    this.now = new Date();
  },

  computed: {
    getUser() {
      return this.$store.getters["getUser"];
    },
    getCompanion() {
      return this.$store.getters["getCompanion"];
    },
    publishTime() {
      const date = new Date(this.date);

      const elapsed = +(
        Math.abs(date - this.now) /
        (1000 * 60 * 60 * 24)
      ).toFixed(1);
      if (elapsed < 1) {
        return "Today";
      } else if (elapsed < 2) {
        return "Yesterday";
      } else if (elapsed < 7) {
        return `${elapsed} days ago`;
      }
      return new Intl.DateTimeFormat("en-US").format(date);
    },
  },
};
</script>

<style scoped>
.message-container {
  display: flex;
  align-self: flex-end;
  gap: 0.5rem;
}

.time {
  font-size: 0.75rem;
  color: #f3f6ff;
}

.message-container--companion {
  align-self: flex-start;
  flex-direction: row-reverse;
}

.avt__text {
  color: #fff;
  mix-blend-mode: difference;
  text-transform: uppercase;
}

.avt {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 2rem;
  align-self: flex-end;
  box-shadow: 4px 8px 16px 0px rgb(34 60 80 / 18%);
}

.mes--companion,
.mes {
  max-width: clamp(11rem, 30vw, 20rem);
  padding: 1rem;
  margin-bottom: 2rem;
  border-radius: 30px;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  overflow-wrap: break-word;
  padding-bottom: 0.5rem;
  padding-right: 1.25rem;
}
.mes {
  background-color: #f26baa;

  color: white;
  padding-left: 2rem;
  border-bottom-right-radius: 0;
  text-align: right;
}

.mes--companion {
  background-color: white;
  padding-right: 2rem;
  color: #000;

  border-bottom-left-radius: 0;
  text-align: left;
  box-shadow: 10px 9px 11px 0px rgb(34 60 80 / 8%);
}

.mes--companion .time {
  color: #bcc4ce;
}

@media (max-width: 350px) {
  .mes,
  .mes--companion {
    max-width: clamp(8rem, 30vw, 20rem);
    font-size: 0.9rem;
  }

  .mes {
    padding-left: 1rem;
  }

  .mes--companion {
    padding-right: 1rem;
  }
}
</style>
