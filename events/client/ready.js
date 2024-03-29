const { Client, ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  function: "ready",
  once: true,
  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    console.log(
      `Client connected.\nAccount: ${
        client.user.username + "#" + client.user.discriminator
      }\nID: ${client.user.id}`
    );

    client.user.setActivity("/help", { type: ActivityType.Listening });
  },
};
