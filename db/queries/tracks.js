import db from "#db/client";

// create a track
export async function createTrack(name, duration) {
  const sql = `
INSERT INTO tracks(name, duration_ms)
VALUES($1, $2)
RETURNING *
`;
  const values = [name, duration];

  const { rows } = await db.query(sql, values);
  return rows[0];
}

// get all tracks
export async function getAllTracks() {
  const sql = `
  SELECT *
  FROM tracks
  `;

  const { rows: tracks } = await db.query(sql);
  return tracks;
}

// get track by id
export async function getTrackById(id) {
  const sql = `
  SELECT *
  FROM tracks
  WHERE id = $1
  `;
  const values = [id];

  const {
    rows: [track],
  } = await db.query(sql, values);
  return track;
}
