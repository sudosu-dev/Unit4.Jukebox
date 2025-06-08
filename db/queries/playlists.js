import db from "#db/client";
// - `GET /playlists` sends array of all playlists
// - `POST /playlists` creates a new empty playlist
// - `GET /playlists/:id` sends playlist specified by id
// - `GET /playlists/:id/tracks` sends all tracks in the playlist
// - `POST /playlists/:id/tracks` adds a new track to the playlist
//   - `trackId` should be sent in request body
//   - Sends the created `playlist_track` with status 201

// create playlist
export async function createPlaylist(name, description) {
  const sql = `
    INSERT INTO playlists(name, description)
    VALUES($1, $2)
    RETURNING *
    `;
  const values = [name, description];

  const { rows } = await db.query(sql, values);
  return rows[0];
}

// get all playlists
export async function getAllPlaylists() {
  const sql = `
  SELECT *
  FROM playlists
  `;

  const { rows: playlists } = await db.query(sql);
  return playlists;
}

// get playlist by id
export async function getPlaylistById(id) {
  const sql = `
  SELECT *
  FROM playlists
  WHERE id = $1
  `;
  const values = [id];

  const {
    rows: [playlist],
  } = await db.query(sql, values);
  return playlist;
}

// get all tracks from a playlist by playlist id
export async function getAllTracksByPlaylistId(id) {
  const sql = `
  SELECT tracks.*
  FROM tracks
  JOIN playlists_tracks ON tracks.id = playlists_tracks.track_id
  WHERE playlists_tracks.playlist_id = $1
  `;
  const values = [id];

  const { rows: tracks } = await db.query(sql, values);
  return tracks;
}

// add a new track to a playlist by playlist id
export async function createPlaylistTracks(playlistId, trackId) {
  const sql = `
    INSERT INTO playlists_tracks(playlist_id, track_id)
    VALUES($1, $2)
    RETURNING *
    `;
  const values = [playlistId, trackId];

  const { rows } = await db.query(sql, values);
  return rows[0];
}
