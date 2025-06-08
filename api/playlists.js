// `/playlists` router
import express from "express";
import db from "#db/client";
import {
  getAllPlaylists,
  getPlaylistById,
  getAllTracksByPlaylistId,
  createPlaylist,
  createPlaylistTracks,
} from "#db/queries/playlists";
import handleAsync from "#middleware/handleAsync";
import { id_ID } from "@faker-js/faker";

const router = express.Router();

router.param("id", async (req, res, next, id) => {
  try {
    const playlistId = Number(id);
    if (isNaN(playlistId)) {
      const error = new Error("ID must be a number.");
      error.status = 400;
      throw error;
    }

    const playlist = await getPlaylistById(playlistId);

    if (!playlist) {
      const error = new Error("Playlist not found.");
      error.status = 404;
      throw error;
    }

    req.playlist = playlist;
    next();
  } catch (error) {
    next(error);
  }
});

// - `GET /playlists` sends array of all playlists
// - `POST /playlists` creates a new empty playlist
router
  .route("/")
  .get(
    handleAsync(async (req, res) => {
      const playlists = await getAllPlaylists();
      res.send(playlists);
    })
  )
  .post(
    handleAsync(async (req, res) => {
      if (!req.body) {
        const error = new Error("Request body required.");
        error.status = 400;
        throw error;
      }
      const { name, description } = req.body;

      if (!name || !description) {
        const error = new Error("Request body needs: name and description.");
        error.status = 400;
        throw error;
      }
      const playlist = await createPlaylist(name, description);
      res.status(201).send(playlist);
    })
  );

// - `GET /playlists/:id` sends playlist specified by id
router.route("/:id").get(
  handleAsync(async (req, res) => {
    res.send(req.playlist);
  })
);

// - `GET /playlists/:id/tracks` sends all tracks in the playlist
router
  .route("/:id/tracks")
  .get(
    handleAsync(async (req, res) => {
      const tracks = await getAllTracksByPlaylistId(req.playlist.id);
      res.send(tracks);
    })
  )
  .post(
    handleAsync(async (req, res) => {
      if (!req.body) {
        const error = new Error("Request body required.");
        error.status = 400;
        throw error;
      }
      const playlistId = req.playlist.id;
      const { trackId } = req.body;

      if (!trackId) {
        const error = new Error("Request body needs: track id.");
        error.status = 400;
        throw error;
      }

      const trackIdNumber = Number(trackId);
      if (isNaN(trackIdNumber)) {
        const error = new Error("Track ID must be a number.");
        error.status = 400;
        throw error;
      }

      const trackExists = await db.query(
        `SELECT id FROM tracks WHERE id = $1`,
        [trackIdNumber]
      );

      if (trackExists.rows.length === 0) {
        const error = new Error("Track does not exist.");
        error.status = 400;
        throw error;
      }
      const existing = await db.query(
        `
        SELECT *
        FROM playlists_tracks
        WHERE playlist_id = $1
        AND track_id = $2
        `,
        [playlistId, trackId]
      );

      if (existing.rows.length > 0) {
        const error = new Error("Track ID already exists in this playlist.");
        error.status = 400;
        throw error;
      }
      const playlistTrack = await createPlaylistTracks(
        playlistId,
        trackIdNumber
      );
      res.status(201).send(playlistTrack);
    })
  );

// - `POST /playlists/:id/tracks` adds a new track to the playlist
//   - `trackId` should be sent in request body
//   - Sends the created `playlist_track` with status 201

export default router;
