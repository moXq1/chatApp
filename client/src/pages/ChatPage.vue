<template>
  <div class="chat">
    <users-list :users="users" :show="sideMenu" @exit="exit"></users-list>

    <modal-files
      v-if="isModalOpen"
      :isOpen="isModalOpen"
      :files="getFiles"
      @closeModal="closeModal"
    ></modal-files>

    <div
      class="back"
      :class="{ show: sideMenu }"
      @click="sideMenu = false"
    ></div>

    <div class="chat__interface">
      <div class="room__wrapper">
        <div class="room">
          <div class="room__hm" @click="sideMenu = true">
            <div class="hm-outer">
              <div class="hm"></div>
            </div>
          </div>
          <div
            class="room__avatar"
            :style="{
              backgroundColor: id
                ? getCompanion.avatar
                : `hsl(${Math.random() * 360},${75}%,${
                    Math.random() * (100 - 60 + 1) + 60
                  }%)`,
            }"
          >
            <div class="text">
              {{ id ? getCompanion.name[0] : "a" }}
            </div>
          </div>
          <div class="room__name">{{ id ? getCompanion.name : "All" }}</div>
        </div>
        <button class="logout" @click.prevent="logout">Sign out</button>
      </div>

      <div class="messages" ref="list">
        <the-message
          v-for="(mes, i) in data.messages"
          :key="mes.id"
          :id="mes.id"
          :date="mes.date"
          :data-last="i === data.messages.length - 1 ? 'last' : null"
        >
          {{ mes.message }}
        </the-message>
      </div>
      <send-message @sending="sendData"></send-message>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import SendMessage from "../components/SendMessage.vue";
import UsersList from "../components/UsersList.vue";
import TheMessage from "../components/TheMessage.vue";

import ModalFiles from "../components/ModalFiles.vue";
import crypto from "crypto";

export default {
  components: { SendMessage, UsersList, TheMessage, ModalFiles },

  data() {
    return {
      socket: null,
      curId: null,
      interval: null,
      doc: null,
      users: null,
      sideMenu: false,
      data: {
        messages: [],
      },
    };
  },
  props: ["id"],
  updated() {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been re-rendered
      const container = this.$el.querySelector("[data-last]");

      if (container) {
        container.scrollIntoView({ block: "end", behavior: "smooth" });
      }
    });
  },
  watch: {
    id(value) {
      this.socket.disconnect();
      this.curID = this.id;
      this.socketsManip(value);
    },
  },

  created() {
    this.$store.dispatch("setOpenModal", false);
    this.$store.dispatch("setFiles", []);
    this.curID = this.id;

    this.socketsManip(this.id);

    if (!this.getCompanion) {
      const comp = JSON.parse(localStorage.getItem("companion"));
      if (comp) {
        this.$store.dispatch("setCompanion", comp);
      }
    }
  },
  beforeUnmount() {
    this.socket.disconnect();
    this.socket.off("receive-message");
    if (this.interval) {
      clearInterval(this.interval);
    }
  },

  methods: {
    sendData(message) {
      if (this.socket && message) {
        let time = Date.now();

        this.data.messages.push({ message, id: this.getUser.id, date: time });
        this.socket.emit("send-message", {
          message,
          id: this.getUser.id,
          date: time,
        });
      }
    },

    exit(s) {
      this.sideMenu = s;
    },

    logout() {
      this.socket.disconnect();
      this.socket.off("receive-message");
      if (this.interval) {
        clearInterval(this.interval);
      }
      localStorage.removeItem("user");

      this.$store.dispatch("logout", null);
      this.$router.push("/auth");
    },

    savingData() {
      this.interval = setInterval(() => {
        //console.log(this.data);
        this.socket.emit("save-chat", this.data);
      }, 2000);
    },

    socketsManip(id) {
      this.socket = io("http://localhost:3001");

      this.socket.emit("get-users");

      this.socket.once("load-users", (users) => {
        this.users = users.filter((el) => el._id !== this.getUser.id);
        let id = this.getUser.id;
        this.users = this.users.map((el) => {
          let arr = [id, el._id].sort((a, b) => a.localeCompare(b));
          let hashPwd = crypto
            .createHash("sha1")
            .update(arr.join(""))
            .digest("hex");
          el.to = `/chat/${hashPwd}`;
          return el;
        });
      });

      this.socket.on("receive-message", (mes) => {
        this.data.messages.push(mes);
      });

      let cId = id;

      if (this.$route.path === "/") {
        cId = "main";
      }

      if (cId && this.socket) {
        this.socket.once("load-chat", (doc) => {
          this.data = doc.data;
          console.log("Loaded", doc);
        });

        this.savingData();
      }

      console.log(this.$route.path);

      this.socket.emit("get-chat", cId);
    },

    closeModal(isOpen, files) {
      this.$store.dispatch("setOpenModal", isOpen);
      this.$store.dispatch("setFiles", files);
    },
  },

  computed: {
    getUser() {
      return this.$store.getters["getUser"];
    },
    getCompanion() {
      return this.$store.getters["getCompanion"];
    },

    isModalOpen() {
      return this.$store.getters["isModalOpen"];
    },

    getFiles() {
      return this.$store.getters["getFiles"];
    },
  },
};
</script>

<style>
.messages {
  padding: 1rem;
  width: 90%;
  /* height: calc(100% - 4rem); */
  display: flex;
  flex-direction: column;
  /* max-height: calc(100% - 4rem); */
  overflow-y: auto;
  margin: 0 auto;
}

.logout {
  color: #7c8c9f;
  background-color: white;
  border: none;
  font-size: 1rem;
  border-radius: 15px;
  padding: 0.5rem 1rem;
  box-shadow: 8px 5px 13px 0px rgb(34 60 80 / 5%);
  cursor: pointer;
  transition: all 0.5s ease;
}

.logout:hover {
  transform: translateY(-3px);
  box-shadow: 10px 12px 20px 0px rgb(34 60 80 / 18%);
}

.logout:active {
  transform: translateY(0px);
  transition: all 0s ease;
  box-shadow: 4px 6px 12px 0px rgb(34 60 80 / 31%);
}

.chat {
  display: flex;
  height: 90vh;
  width: 100%;
  justify-content: space-around;
  background-color: #f3f6ff;
  border-radius: 30px;
  position: relative;
  overflow: hidden;
}

.chat__interface {
  width: clamp(19rem, 60vw, 64rem);
  border-radius: 12px;
  height: 90%;
  margin: auto 0;
  display: grid;
  gap: 1rem;
  grid-template-rows: min-content 1fr min-content;
}

.room {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.text {
  color: #fff;
  text-transform: uppercase;
  mix-blend-mode: difference;
}

.room__wrapper {
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.room__avatar {
  height: 3rem;
  width: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 4px 8px 16px 0px rgb(34 60 80 / 18%);
}

.hm {
  width: 30px;
  height: 4px;
  background-color: #000;
  position: absolute;
  top: 50%;
  display: block;
  margin-top: -2px;
  left: 0;
  border-radius: 4px;
}

.hm-outer {
  position: relative;
  width: 30px;
  height: 24px;
}

.hm:before,
.hm:after {
  content: "";
  position: absolute;
  width: 30px;
  height: 4px;
  background-color: #000;
  border-radius: 4px;

  left: 0;
  display: block;
}

.hm:before {
  top: -10px;
}

.hm:after {
  bottom: -10px;
}

.room__hm {
  display: none;
  cursor: pointer;
  margin-right: 1rem;
}

.back {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000;
  opacity: 0.5;
  bottom: 0;
  right: 0;
  z-index: 2;
  border-radius: 30px;
  display: none;
}

.show {
  display: block;
}

@media (max-width: 800px) {
  .room__hm {
    display: block;
  }

  .chat__interface {
    width: clamp(19rem, 90vw, 64rem);
  }
}

@media (min-width: 801px) {
  .back {
    display: none;
  }
}
</style>
