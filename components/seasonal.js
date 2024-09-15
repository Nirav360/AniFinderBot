const axios = require("axios");

const JIKAN_SEASON_BASE = "https://api.jikan.moe/v4/seasons";

// Fetch seasonal anime
async function getSeasonalAnime(year, season) {
  const url = `${JIKAN_SEASON_BASE}/${year}/${season}`;

  try {
    const response = await axios.get(url);
    const animeList = response.data.data;

    if (animeList.length === 0) {
      return "No seasonal anime found for that period.";
    }

    const topAnime = animeList
      .slice(0, 10)
      .map(
        (anime) =>
          `${anime.title_english} - ${anime.title}\nScore: ${anime.score}\nEpisodes: ${anime.episodes}\nLink: ${anime.url}\nStatus: ${anime.status}`
      )
      .join("\n\n");
    return `Top 5 anime for ${season} ${year}:\n\n${topAnime}`;
  } catch (error) {
    return "An error occurred while fetching the seasonal anime.";
  }
}

module.exports = getSeasonalAnime;
