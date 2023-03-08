const { Client } = require("discord.js");
const { storage } = require("../schemas/guild");

/**
 *
 * @param {Client} client
 */
async function loadGuilds(client) {
  client.guilds.cache.forEach(async (guild) => {
    const server = await storage.findOne({ guild: guild.id });
    if (!server) {
      (await storage.create({
        guild: guild.id,
        logs: {
          events: [],
          enabled: false,
          channel: null,
        },
      })) &&
        console.log(
          `Created a blank Rift configuration for new guild: ${guild.name}.`
        );
      return;
    } else {
      return console.log(`Loaded configuration for guild: ${guild.name}`);
    }
  });
}

module.exports = {
  loadGuilds,
};
