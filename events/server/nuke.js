const { createTranscript } = require("discord-html-transcripts");
const {
  ButtonInteraction,
  Client,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  time,
} = require("discord.js");
const { types } = require("../../types/types");
const { logs } = require("../../types/logs");

module.exports = {
  name: "interactionCreate",
  function: "nuke",
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("nuke")) return;
    const cache = client.cache.get(interaction.message.id);
    if (!cache)
      return interaction.reply({
        content: "This button menu has expired.",
        ephemeral: true,
      });
    if (cache !== interaction.user.id)
      return interaction.reply({
        content: "This isn't your button menu.",
        ephemeral: true,
      });

    const args = interaction.customId.split(".");
    const channel = client.channels.cache.get(args[1]);
    const reason = args[2];
    const staff = client.guilds.cache
      .get(channel.guildId)
      .members.cache.get(args[3]);

    const timestamp = parseInt(interaction.createdTimestamp / 1000);

    const Attachment = await createTranscript(channel, {
      limit: -1,
      poweredBy: false,
      saveImages: true,
    });
    const newChannel = await channel.clone();
    if (channel.deletable) {
      await channel.delete();
    }

    await logs.nuke(channel, newChannel, reason, staff, timestamp, Attachment);

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Green)
          .setDescription(
            `> ${types.formats.yes} Successfully nuked ${channel.name} (${newChannel}).\n> Reason: ${reason}`
          ),
      ],
      components: [
        new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId("exit")
            .setLabel("Exit")
            .setStyle(ButtonStyle.Danger)
        ),
      ],
    });
  },
};
