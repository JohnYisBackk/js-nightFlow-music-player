// =============================================
// 1. DOM ELEMENTS
// =============================================

const cover = document.getElementById("cover");

const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const progressBar = document.getElementById("progressBar");
const progressTrack = document.getElementById("progressTrack");
const progressThumb = document.querySelector(".progress-thumb");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const volumeSlider = document.getElementById("volumeSlider");

const playlistList = document.getElementById("playlistList");
const playlistCount = document.getElementById("playlistCount");
const favoriteBtn = document.getElementById("favoriteBtn");

const audio = new Audio();

// =============================================
// LOAD FROM LOCAL STORAGE
// =============================================

function loadPlayerState() {
  const savedIndex = localStorage.getItem("currentSongIndex");
  const savedVolume = localStorage.getItem("volume");
  const savedShuffle = localStorage.getItem("isShuffle");
  const savedRepeat = localStorage.getItem("isRepeat");

  if (savedIndex !== null) {
    currentSongIndex = Number(savedIndex);
  }

  if (savedVolume !== null) {
    volumeSlider.value = savedVolume;
    audio.volume = savedVolume / 100;
  }
  if (savedShuffle !== null) {
    isShuffle = JSON.parse(savedShuffle);
  }

  if (savedRepeat !== null) {
    isRepeat = JSON.parse(savedRepeat);
  }
}

// =============================================
// 2. SONGS DATA
// =============================================

const songs = [
  {
    id: 1,
    title: "Midnight Vibes",
    artist: "Lo-Fi Artist",
    src: "songs/song1.mp3",
    cover:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    duration: "3:12",
  },
  {
    id: 2,
    title: "Night Drive",
    artist: "Synthwave",
    src: "songs/song2.mp3",
    cover:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    duration: "2:58",
  },
  {
    id: 3,
    title: "After Hours",
    artist: "Neon Dreams",
    src: "songs/song3.mp3",
    cover:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    duration: "3:45",
  },
];
// =============================================
// 3. PLAYER STATE
// =============================================

let currentSongIndex = 0;
let isPlaying = false;
let isRepeat = false;
let isShuffle = false;

// =============================================
// 4. LOAD SONG
// =============================================

function loadSong(index) {
  const song = songs[index];

  audio.src = song.src;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  cover.src = song.cover;
  durationEl.textContent = song.duration;

  updateFavoriteButton();
}

// =============================================
// 5. RENDER PLAYLIST
// =============================================

function renderPlaylist() {
  let html = "";

  songs.forEach((song, index) => {
    html += `
      <article 
        class="playlist-item ${index === currentSongIndex ? "active" : ""}"
        data-index="${index}"
      >
        <img src="${song.cover}" class="playlist-item-cover" />

        <div class="playlist-item-info">
          <h3>${song.title}</h3>
          <p>${song.artist}</p>
        </div>

        <span class="playlist-item-duration">
          ${song.duration}
        </span>
      </article>
    `;
  });

  playlistList.innerHTML = html;
}

// =============================================
// 6. PLAY SONG
// =============================================

function playSong() {
  audio.play();

  isPlaying = true;

  playBtn.textContent = "⏸";
}

// =============================================
// 7. PAUSE SONG
// =============================================

function pauseSong() {
  audio.pause();

  isPlaying = false;
  playBtn.textContent = "▶";
}

// =============================================
// 8. PLAY / PAUSE BUTTON
// =============================================

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// =============================================
// 9. NEXT SONG
// =============================================

function nextSong() {
  if (isShuffle) {
    let randomIndex = Math.floor(Math.random() * songs.length);
    if (songs.length > 1) {
      while (randomIndex === currentSongIndex) {
        randomIndex = Math.floor(Math.random() * songs.length);
      }
    }

    currentSongIndex = randomIndex;
  } else {
    currentSongIndex++;

    if (currentSongIndex >= songs.length) {
      currentSongIndex = 0;
    }
  }

  loadSong(currentSongIndex);
  playSong();
  savePlayerState();
  renderPlaylist();
}

// =============================================
// 10. PREVIOUS SONG
// =============================================

function prevSong() {
  currentSongIndex--;

  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }

  loadSong(currentSongIndex);
  playSong();
  renderPlaylist();
  savePlayerState();
}

// =============================================
// 11. NEXT / PREV EVENTS
// =============================================

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// =============================================
// 12. UPDATE PROGRESS BAR
// =============================================

audio.addEventListener("timeupdate", () => {
  const currentTime = audio.currentTime;
  const duration = audio.duration;

  if (!duration) return;

  const progressPercent = (currentTime / duration) * 100;

  progressBar.style.width = `${progressPercent}%`;

  progressThumb.style.left = `${progressPercent}%`;

  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
});

// =============================================
// 13. FORMAT TIME
// =============================================

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return `${minutes}:${seconds}`;
}

// =============================================
// 15. CLICK ON PROGRESS TRACK
// =============================================

progressTrack.addEventListener("click", (e) => {
  const rect = progressTrack.getBoundingClientRect();

  const clickX = e.clientX - rect.left;

  const width = rect.width;
  const percent = clickX / width;

  const duration = audio.duration;

  if (!duration) return;

  audio.currentTime = percent * duration;
});

// =============================================
// 16. VOLUME CONTROL
// =============================================

volumeSlider.addEventListener("input", () => {
  const volume = volumeSlider.value;

  audio.volume = volume / 100;

  savePlayerState();
});

// =============================================
// 17. CLICK PLAYLIST ITEM
// =============================================

playlistList.addEventListener("click", (e) => {
  const item = e.target.closest(".playlist-item");

  if (!item) return;

  const index = Number(item.dataset.index);

  currentSongIndex = index;

  loadSong(currentSongIndex);
  playSong();
  renderPlaylist();
  savePlayerState();
});

// =============================================
// 18. AUTO NEXT SONG
// =============================================

audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

// =============================================
// HELPER FUNCTIONS
// =============================================

function getFavoriteSongs() {
  const savedFavorites = localStorage.getItem("favoriteSongs");
  return savedFavorites ? JSON.parse(savedFavorites) : [];
}

function saveFavoriteSongs(favorites) {
  localStorage.setItem("favoriteSongs", JSON.stringify(favorites));
}

function updateFavoriteButton() {
  const favorites = getFavoriteSongs();
  const currentSongId = songs[currentSongIndex].id;

  if (favorites.includes(currentSongId)) {
    favoriteBtn.classList.add("active");
    favoriteBtn.textContent = "Added to Favorites";
  } else {
    favoriteBtn.classList.remove("active");
    favoriteBtn.textContent = "Add to Favorites";
  }
}

// =============================================
// 19. FAVORITE BUTTON
// =============================================

favoriteBtn.addEventListener("click", () => {
  const favorites = getFavoriteSongs();
  const currentSongId = songs[currentSongIndex].id;

  if (favorites.includes(currentSongId)) {
    const updatedFavorites = favorites.filter((id) => id !== currentSongId);
    saveFavoriteSongs(updatedFavorites);
  } else {
    favorites.push(currentSongId);
    saveFavoriteSongs(favorites);
  }

  updateFavoriteButton();
});

// =============================================
// SHUFFLE / REPEAT TOGGLES
// =============================================

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
  savePlayerState();
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
  savePlayerState();
});

// =============================================
// 20. LOCAL STORAGE
// =============================================

function savePlayerState() {
  localStorage.setItem("currentSongIndex", currentSongIndex);
  localStorage.setItem("volume", volumeSlider.value);
  localStorage.setItem("isShuffle", JSON.stringify(isShuffle));
  localStorage.setItem("isRepeat", JSON.stringify(isRepeat));
}

// =============================================
// 21. INIT APP
// =============================================

loadPlayerState();

if (!localStorage.getItem("volume")) {
  volumeSlider.value = 100;
}

audio.volume = volumeSlider.value / 100;

loadSong(currentSongIndex);
renderPlaylist();
playlistCount.textContent = `${songs.length} tracks`;

shuffleBtn.classList.toggle("active", isShuffle);
repeatBtn.classList.toggle("active", isRepeat);
