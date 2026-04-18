# 🎧 NightFlow Music Player

A modern, dark-themed music player built with **pure JavaScript, HTML, and CSS**.  
Designed with a premium UI inspired by real-world streaming apps like Spotify and Apple Music.

---

## 🚀 Live Demo

👉 https://johnyisbackk.github.io/js-nightFlow-music-player/

---

## ✨ Features

- ▶️ Play / Pause music
- ⏭️ Next / Previous track
- 📃 Interactive playlist (click to play)
- 📊 Real-time progress bar
- 🎯 Seek (click on progress bar to jump)
- 🔊 Volume control
- 🔁 Repeat mode
- 🔀 Shuffle mode
- ❤️ Favorite songs (saved in localStorage)
- 💾 Persistent state (song + volume)
- 🎨 Modern dark UI
- 📱 Fully responsive (mobile optimized)

---

## 🧠 Tech Stack

- HTML5
- CSS3 (custom properties, modern UI)
- Vanilla JavaScript (no frameworks)

---

## 🎵 Audio Files

⚠️ **Audio files are NOT included in this repository.**

This is intentional to avoid copyright issues.

To test the music player:

1. Create a folder called `songs`
2. Add your own `.mp3` files
3. Update the `songs` array in `script.js`

Example:

```js
const songs = [
  {
    id: 1,
    title: "Your Song",
    artist: "Artist Name",
    src: "songs/song1.mp3",
    cover: "your-image-url",
    duration: "3:12"
  }
];
