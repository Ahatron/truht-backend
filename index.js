import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import router from "./routes/index.js";
import db from "./db.js";
import multer from "multer";
import { createDirectories } from "./utils/file-system.utils.js";

const ALLOWED_ORIGIN = "http://localhost:3000";
const port = process.env.PORT || 8080;

const app = express();

app
  .use(
    cors({
      origin: ALLOWED_ORIGIN,
      optionsSuccessStatus: 200,
    })
  )
  .use(express.json());

const server = createServer(app);
const io = new Server(server, { cors: { origin: ALLOWED_ORIGIN } });

const uplaods = {
  path: "/uploads",
  childs: [
    {
      path: "/media",
      childs: [{ path: "/images" }, { path: "/videos" }],
    },
  ],
};

createDirectories(uplaods, ".");

const storage = multer.diskStorage({
  destination: function (_, file, cb) {
    let destination = "." + uplaods.path + "/media";
    if (file.mimetype.startsWith("image/")) destination += "/images";
    else if (file.mimetype.startsWith("video/")) destination += "/videos";

    cb(null, destination);
  },
  filename: function (_, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Имя файла после сохранения
  },
});

const upload = multer({ storage: storage });

app.use("/api", upload.array("files"), router);

app.use((_, res) => {
  res.status(404).send("Страница не найдена");
});

io.on("connection", (socket) => {
  console.log("Пользователь подключился");

  // Обработка события от клиента
  socket.on("clientConnected", (data) => {
    console.log("Получено событие от клиента:", data);

    // Отправка ответа обратно клиенту
    socket.emit("serverResponse", "Привет, клиент!");
  });

  socket.on("disconnect", () => {
    console.log("Пользователь отключился");
  });
});

async function startApp() {
  try {
    await db.sync({ alter: true });
    console.log("All models were synchronized successfully.");
    server.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (e) {
    console.error("Server starting error:", e);
  }
}

startApp();
