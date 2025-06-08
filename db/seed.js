import db from "#db/client";
import { faker } from "@faker-js/faker";
import { createTrack } from "./queries/tracks.js";
import { createPlaylist, createPlaylistTracks } from "./queries/playlists.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const tracks = [];
  const playlists = [];
  const usedPairs = [];

  // ------- TRACKS -------
  // Seed 20 tracks
  // id SERIAL PRIMARY KEY,
  // name TEXT NOT NULL,  faker.music.songName()
  // duration_ms INT NOT NULL,  faker.number.int({ min: 120000, max: 360000 })
  for (let i = 0; i < 20; i++) {
    const name = faker.music.songName();
    const duration = faker.number.int({ min: 120000, max: 360000 });
    const track = await createTrack(name, duration);
    console.log("Track: ", track);
    tracks.push(track);
  }

  // ------- PLAYLISTS -------
  // Seed 10 playlists
  // id SERIAL PRIMARY KEY,
  // name TEXT NOT NULL,  faker.word.adjective() + ' ' + faker.music.genre()
  // description TEXT NOT NULL, faker.lorem.sentence()
  for (let i = 0; i < 10; i++) {
    const name = faker.word.adjective() + " " + faker.music.genre();
    const description = faker.lorem.sentence();
    const playlist = await createPlaylist(name, description);
    console.log("Playlist: ", playlist);
    playlists.push(playlist);
  }

  // ------- PLAYLISTS_TRACKS -------
  // Seed 15 playlists_tracks
  // id SERIAL PRIMARY KEY,
  // playlist_id INT NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  // track_id INT NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  // UNIQUE (playlist_id, track_id)
  let pairsCreated = 0;
  while (pairsCreated < 15) {
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    const randomPlaylist =
      playlists[Math.floor(Math.random() * playlists.length)];
    const randomPlaylistTrack = `${randomPlaylist.id}-${randomTrack.id}`;
    console.log("Random Playlist Track is: ", randomPlaylistTrack);
    if (!usedPairs.includes(randomPlaylistTrack)) {
      const [playlistId, trackId] = randomPlaylistTrack.split("-").map(Number);

      const createdPlaylistTrack = await createPlaylistTracks(
        playlistId,
        trackId
      );
      console.log("Playlist-Tracks: ", createdPlaylistTrack);
      usedPairs.push(randomPlaylistTrack);
      pairsCreated++;
    }
  }
}
