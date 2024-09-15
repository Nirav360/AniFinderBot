const axios = require("axios");

const JIKAN_API_BASE = "https://api.jikan.moe/v4/anime";

// Recommend a random anime
async function getRandomAnime() {
  const randomId = Math.floor(Math.random() * 10000);
  const url = `${JIKAN_API_BASE}/${randomId}`;

  try {
    const response = await axios.get(url);
    const anime = response.data.data;
    return `${anime.title}\nScore: ${anime.score}\nEpisodes: ${anime.episodes}\nSynopsis: ${anime.synopsis}\nLink: ${anime.url}`;
  } catch (error) {
    return "Could not find a random anime. Try again!";
  }
}

module.exports = getRandomAnime;
