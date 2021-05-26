const mongoose = require("mongoose");
const Chat = require("./Chat");
const User = require("./User");

mongoose.connect("mongodb://localhost/chat-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

const defaultValue = { messages: [] };

io.on("connection", (socket) => {
  socket.on("get-chat", async (id) => {
    socket.join(id);
    const data = await findCreateChat(id);

    socket.emit("load-chat", data);
    socket.on("send-message", (message) => {
      socket.broadcast.to(id).emit("receive-message", message);
    });

    socket.on("save-chat", async (data) => {
      console.log(id);
      await Chat.findByIdAndUpdate(id, { data });
    });
  });

  socket.on("get-user", async (userData) => {
    const data = await createUser(userData);

    socket.emit("load-user", data);
  });
  socket.on("login-user", async (userData) => {
    const data = await loginUser(userData);

    socket.emit("load-loginUser", data);
  });

  socket.on("get-users", async () => {
    const users = await getAllDBUsers();
    socket.emit("load-users", users);
  });

  console.log("connected");
});

async function getAllDBUsers() {
  const users = await User.find({});

  if (!users) {
    return;
  }

  return users;
}

async function findCreateChat(id) {
  //await Chat.remove({});

  if (id === null) {
    return;
  }

  const chat = await Chat.findById(id);

  console.log(chat);
  if (chat) {
    return chat;
  }

  return await Chat.create({ _id: id, data: defaultValue });
}

async function createUser(userData) {
  console.log(userData);
  if (userData === null) {
    return;
  }
  const user = await User.findOne({ email: userData.email });

  if (user) {
    return;
  }

  return await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    avatar: `hsl(${Math.random() * 360},${75}%,${
      Math.random() * (100 - 60 + 1) + 60
    }%)`,
  });
}

async function loginUser(userData) {
  if (userData.email === null) {
    return;
  }
  const user = await User.findOne({ email: userData.email });
  if (!user) {
    return;
  }
  if (user.password === userData.password) {
    return user;
  }
  return;
}
