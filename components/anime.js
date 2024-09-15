const axios = require("axios");

const JIKAN_API_BASE = "https://api.jikan.moe/v4/anime";

// Search for anime
async function searchAnime(query) {
  const url = `${JIKAN_API_BASE}?q=${query}&limit=1`;

  try {
    const response = await axios.get(url);
    if (response.data.data.length === 0) {
      return "No anime found with that title.";
    }

    const anime = response.data.data[0];
    return `${anime.title_english} - ${anime.title}\nScore: ${anime.score}\nEpisodes: ${anime.episodes}\nSynopsis: ${anime.synopsis}\nLink: ${anime.url}\nTrailer: ${anime.trailer.url}\nStatus: ${anime.status}`;
  } catch (error) {
    return "An error occurred while fetching the anime data.";
  }
}

module.exports = searchAnime;
