import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import db from "./db.js";

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

app.use("/api", userRoutes);

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
    await db.sync();
    server.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (e) {
    console.error("Server starting error:", e);
  }
}

startApp();
