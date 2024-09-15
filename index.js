require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const searchAnime = require("./components/anime");
const getRandomAnime = require("./components/random");
const getSeasonalAnime = require("./components/seasonal");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Bot is ready
client.once("ready", () => {
  console.log("Anime bot is online!");
});

// Function to get current season based on month
function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  let season;

  if (month >= 1 && month <= 3) {
    season = "winter";
  } else if (month >= 4 && month <= 6) {
    season = "spring";
  } else if (month >= 7 && month <= 9) {
    season = "summer";
  } else {
    season = "fall";
  }

  return { year, season };
}

// Helper function to split long messages into chunks
function splitMessage(content, maxLength = 2000) {
  const lines = content.split("\n\n");
  const chunks = [];
  let currentChunk = "";

  lines.forEach((line) => {
    if (currentChunk.length + line.length < maxLength) {
      currentChunk += line + "\n\n";
    } else {
      chunks.push(currentChunk);
      currentChunk = line + "\n\n";
    }
  });

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// Listen for commands
client.on("messageCreate", async (message) => {
  // Search Anime Command
  if (message.content.startsWith("!anime")) {
    const query = message.content.split(" ").slice(1).join(" ");
    if (!query) {
      return message.channel.send(
        "Please provide an anime name. Usage: `!anime <name>`"
      );
    }

    const animeInfo = await searchAnime(query);
    message.channel.send(animeInfo);
  }

  // Random Anime Command
  if (message.content === "!randomanime") {
    const animeInfo = await getRandomAnime();
    message.channel.send(animeInfo);
  }

  // Seasonal Anime Command
  if (message.content.startsWith("!seasonal")) {
    const args = message.content.split(" ");

    let { year, season } = getCurrentSeason();

    // Check if year and season are provided
    if (args.length === 3) {
      year = args[1];
      season = args[2].toLowerCase();
    }

    const validSeasons = ["winter", "spring", "summer", "fall"];
    if (!validSeasons.includes(season)) {
      return message.channel.send(
        "Invalid season! Please use one of the following: `winter`, `spring`, `summer`, `fall`."
      );
    }

    const seasonalAnime = await getSeasonalAnime(year, season);
    // Split the message into chunks if it's too long
    const messages = splitMessage(seasonalAnime);

    // Send each message chunk separately
    for (const msg of messages) {
      await message.channel.send(msg);
    }
  }
});

// Log in to Discord with the bot token
client.login(process.env.DISCORD_TOKEN);
