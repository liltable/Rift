const { EmbedBuilder } = require("@discordjs/builders");
const { ChatInputCommandInteraction, Client } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Checks the client's uptime.",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const Uptime = parseInt(client.readyTimestamp / 1000);
    return interaction.reply({
      ephemeral: true,
      embeds: [
        new EmbedBuilder().setDescription(
          `> :satellite: Latency: ${client.ws.ping}ms\n> ⌚ Uptime: Since <t:${Uptime}:f> | <t:${Uptime}:R>`
        ),
      ],
    });
  },
};
