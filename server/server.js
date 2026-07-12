require("dotenv").config();
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const app = require("./app");

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/transitops";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const server = app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on port ${PORT}`);
});

    const io = new Server(server, {
      cors: {
        origin:
          process.env.CLIENT_URL ||
          "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      },
    });

    app.set("io", io);

    const jwt = require("jsonwebtoken");
    const User = require("./models/user");
    const presence = require("./utils/presence");

    io.on("connection", (socket) => {
      console.log("🟢 Socket Connected:", socket.id);

      (async () => {
        try {
          const token = socket.handshake?.auth?.token;

          if (!token) return;

          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
          );

          const user = await User.findById(decoded.id).select(
            "-password"
          );

          if (!user) return;

          presence.add(socket.id, {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          });

          io.emit(
            "presence:update",
            presence.getOnline()
          );
        } catch (err) {
          console.log("Socket Auth Failed");
        }
      })();

      socket.on("logout", () => {
        presence.remove(socket.id);
        io.emit(
          "presence:update",
          presence.getOnline()
        );
      });

      socket.on("disconnect", () => {
        presence.remove(socket.id);
        io.emit(
          "presence:update",
          presence.getOnline()
        );
        console.log("🔴 Socket Disconnected");
      });
    });

    try {
      const reminder = require("./services/licenseReminder");

      setInterval(async () => {
        try {
          await reminder.checkExpiries();
        } catch (err) {
          console.error(err);
        }
      }, 1000 * 60 * 60 * 24);
    } catch (err) {
      console.log(
        "License reminder service not configured."
      );
    }
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed");
    console.error(err);
    process.exit(1);
  });