import express from "express";
import tracksRouter from "./api/tracks.js";
import playlistsRouter from "./api/playlists.js";
import { errorHandler } from "#middleware/errorHandler";

const app = express();

// Middleware to parse JSON
app.use(express.json());

app.use((req, res, next) => {
  console.log("MAIN APP - Method:", req.method, "URL:", req.url);
  next();
});

// register routes
app.use("/tracks", tracksRouter);
app.use("/playlists", playlistsRouter);

// register error handling middleware
app.use(errorHandler);

export default app;
