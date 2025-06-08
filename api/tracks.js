import express from "express";
import { getAllTracks, getTrackById } from "#db/queries/tracks";
import handleAsync from "#middleware/handleAsync";

const router = express.Router();

// sends array of all tracks
router.get(
  "/",
  handleAsync(async (req, res) => {
    const tracks = await getAllTracks();
    res.send(tracks);
  })
);

// sends track specified by id
router.get(
  "/:id",
  handleAsync(async (req, res) => {
    const id = req.params.id;
    if (isNaN(id)) {
      const error = new Error("Track ID must be a number.");
      error.status = 400;
      throw error;
    }

    const track = await getTrackById(id);
    if (!track) {
      const error = new Error("Track not found.");
      error.status = 404;
      throw error;
    }

    res.send(track);
  })
);

export default router;
