const music = document.getElementById("background-music");
const musicToggle = document.getElementById("music-toggle");

musicToggle.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    musicToggle.textContent = "Music On";
  } else {
    music.pause();
    musicToggle.textContent = "Music Off";
  }
});
