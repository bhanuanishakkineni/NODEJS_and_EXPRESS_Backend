import { config } from "dotenv";
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchListRoutes from "./routes/watchListRoutes.js";
// import sampleRoutes from "./routes/sampleRoutes.js";
import cookieParser from "cookie-parser";
import express from "express";
import { connectDB, disconnectDB } from "./config/db.js";

config();
connectDB();
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/watchlist", watchListRoutes);
// app.use("/api/sample", sampleRoutes);

const PORT = 5001;
const server = app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`UNHANDLED Rejection!${err} \\ Shutting down...`);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("uncaughtException", async (err) => {
  console.error(`UNCAUGHT EXCEPTION!${err} \\ Shutting down...`);
  await disconnectDB();
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM RECEIVED! Shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
