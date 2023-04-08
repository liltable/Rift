const { createTranscript } = require("discord-html-transcripts");
const {
  ButtonInteraction,
  Client,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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
    const reason = args[2];
    const guild = client.guilds.cache.get(args[4]);
    const staff = guild.members.cache.get(args[3]);
    const channel = await guild.channels.fetch(args[1]);

    if (!channel || !args || !guild) return;

    const timestamp = parseInt(interaction.createdTimestamp / 1000);

    const Attachment = await createTranscript(channel, {
      limit: -1,
      poweredBy: false,
      saveImages: true,
      filename: `${channel.name}-transcript.html  `,
    });
    const newChannel = await channel.clone();
    channel.delete();
    newChannel.setPosition(channel.position, { reason: reason });
    newChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Orange)
          .setTitle("Rift | Notice")
          .setDescription(
            `> **This channel was nuked.**\n> All messages prior to the nuke were logged and deleted.\n> Staff: ${
              staff ||
              `\`Failed to fetch.\`\n> Date: <t:${timestamp}:f> | <t:${timestamp}:R>\n> Reason: ${reason}`
            } `
          ),
      ],
    });

    if (interaction.message.deletable) {
      interaction.message.delete();
    }

    logs.nuke(channel, newChannel, reason, staff, timestamp, Attachment);

    await interaction.reply({
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
