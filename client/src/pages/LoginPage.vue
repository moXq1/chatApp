<template>
  <div class="wrapper">
    <h1>Chatterino</h1>
    <form @submit.prevent="submitData">
      <label for="" v-if="enterType === 'signIn'">
        <input type="text" placeholder="Name" v-model="nameField" required />
      </label>
      <label for="">
        <div v-if="!emailVerification" class="placeholder">Email not valid</div>
        <input
          type="email"
          name=""
          id=""
          placeholder="Email"
          v-model="emailField"
          @blur="checkEmail"
          required
        />
      </label>
      <label>
        <div v-if="!passwordVerification" class="placeholder">
          Password too short
        </div>
        <input
          type="text"
          placeholder="Password"
          v-model="passwordField"
          required
          @blur="checkPassword"
        />
      </label>

      <p v-if="dataError">Wrong email or password</p>
      <p v-if="userExist">User already exist</p>

      <div class="btns">
        <button>{{ btnText }}</button>
        <button @click.prevent="changeType">{{ btnAltText }}</button>
      </div>
    </form>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  data() {
    return {
      enterType: "signIn",
      btnText: "Sign In",
      btnAltText: "Log In",
      socket: null,
      nameField: "",
      emailField: "",
      passwordField: "",
      emailVerification: true,
      passwordVerification: true,
      verification: false,
      userExist: false,
      dataError: false,
    };
  },

  created() {
    this.socket = io("http://localhost:3001");
  },

  computed: {
    getSocket() {
      return this.$store.getters["getSocket"];
    },
  },
  methods: {
    changeType() {
      this.dataError = false;
      this.userExist = false;
      this.passwordField = "";
      this.emailField = "";
      this.emailVerification = true;
      this.passwordVerification = true;
      if (this.enterType === "signIn") {
        (this.enterType = "logIn"),
          (this.btnAltText = "Sign In"),
          (this.btnText = "Log In");
      } else {
        (this.enterType = "signIn"),
          (this.btnText = "Sign In"),
          (this.btnAltText = "Log In");
      }
    },

    checkPassword() {
      this.passwordVerification = true;
      if (this.passwordField.length < 6) {
        this.passwordVerification = false;
      }
    },

    checkEmail() {
      this.emailVerification = true;
      if (!this.emailField.includes("@")) {
        this.emailVerification = false;
      }
    },

    submitData() {
      this.verification = true;
      this.dataError = false;
      this.userExist = false;
      if (!this.emailVerification || !this.passwordVerification) {
        this.verification = false;
      }

      if (this.verification) {
        if (this.enterType === "signIn") {
          this.socket.emit("get-user", {
            name: this.nameField,
            email: this.emailField,
            password: this.passwordField,
          });

          this.socket.once("load-user", (user) => {
            if (!user) {
              this.userExist = true;
            } else {
              this.nameField = "";
              this.emailField = "";
              this.passwordField = "";
              this.$store.dispatch("setUser", user);
              localStorage.setItem("user", JSON.stringify(user));
              this.$router.push("/");
            }
          });
        }

        if (this.enterType === "logIn") {
          this.socket.emit("login-user", {
            email: this.emailField,
            password: this.passwordField,
          });

          this.socket.once("load-loginUser", (user) => {
            if (!user) {
              this.dataError = true;
            } else {
              this.emailField = "";
              this.passwordField = "";
              this.$store.dispatch("setUser", user);
              localStorage.setItem("user", JSON.stringify(user));
              this.$router.push("/");
            }
          });
        }
      }
    },
  },
};
</script>

<style>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
h1 {
  font-size: 8vw;
  background: transparent;

  border: none;
  font-family: "GT Sectra Display", "Times New Roman", sans-serif;
  font-style: italic;
  font-weight: 700;
  line-height: 1;
  margin-top: 1rem;
  -webkit-text-stroke-width: 0.05vw;
  -webkit-text-stroke-color: #000;
  color: #f3f6f7;
}

p {
  background-color: white;
  border-radius: 30px;
  width: 90%;
  padding: 1rem;
  color: #f57064;
}

/* svg {
  position: absolute;
  top: 0;
  left: 0;
} */

.placeholder {
  position: absolute;
  padding-left: 1rem;
  color: #7c8c9f;
  animation: pm 0.5s ease forwards;
}

@keyframes pm {
  to {
    transform: translateY(-1rem);
    font-size: 0.7rem;
    color: darkred;
  }
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background-color: #f3f6ff;
  border-radius: 15px;
  width: clamp(17rem, 50vw, 30rem);

  z-index: 1;
}

.btns {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

form label {
  background-color: white;
  height: 4rem;
  border-radius: 30px;
  margin: 0 auto;
  width: 90%;
  display: flex;
  align-items: center;
  position: relative;
}

form input {
  padding-left: 1rem;
  width: 100%;
  border-radius: 30px;
  height: 3rem;
  background: transparent;
  color: #7c8c9f;
  border: none;
  font-size: 1rem;
}

form input:focus {
  outline: none;
  box-shadow: 5px 12px 12px 0px rgb(34 60 80 / 16%);
}

.btns button {
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  background: white;
  color: #7c8c9f;
  font-size: 1rem;
  box-shadow: 11px 8px 20px 0px rgb(34 60 80 / 13%);
  cursor: pointer;
  margin: 1.5rem 0;

  transition: all 0.5s ease;
}

.btns button:hover {
  transform: translateY(-3px);
  box-shadow: 10px 12px 20px 0px rgb(34 60 80 / 18%);
}

.btns button:active {
  transform: translateY(0px);
  transition: all 0s ease;
  box-shadow: 4px 6px 12px 0px rgb(34 60 80 / 31%);
}

@media (max-width: 800px) {
  form label {
    height: 3rem;
    border-radius: 30px;
  }

  form input {
    height: 2rem;
  }

  form input:focus {
    outline: none;
    box-shadow: 5px 9px 7px 0px rgb(34 60 80 / 16%);
  }

  h1 {
    font-size: 3rem;
  }
}
</style>
