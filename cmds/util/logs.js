const { EmbedBuilder } = require("@discordjs/builders");
const {
  ChatInputCommandInteraction,
  Client,
  ApplicationCommandOptionType,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const { storage } = require("../../schemas/guild");
const { types } = require("../../types/types");

module.exports = {
  name: "logs",
  description: "Manages Rifts logging module.",
  permission: "ManageGuild",
  options: [
    {
      name: "toggle",
      description: "Enable/Disable logging for this guild.",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "channel",
      description: "Set the channel for Rift's logging for this guild.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "set",
          description: "Select the channel for Rift to log events to.",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
    },
  ],
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, member, guild } = interaction;
    const Sub = options.getSubcommand(true);
    const server = await storage.findOne({ guild: guild.id });
    switch (Sub) {
      case "toggle": {
        const Reply = new EmbedBuilder()
          .setColor(Colors.Red)
          .setDescription(`Toggle logging by Rift for this server?`)
          .setAuthor({
            iconURL: member.user.avatarURL(),
            name: member.user.username + "#" + member.user.discriminator,
          })
          .setThumbnail(`${guild.iconURL()}`);
        const Row = new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId(`logs.toggle`)
            .setLabel("Confirm")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("exit")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({ embeds: [Reply], components: [Row] });
        return client.cache.set(
          (await interaction.fetchReply()).id,
          member.user.id
        );
      }
      case "channel": {
        const channel = options.getChannel("set", true);
        if (!server.logs.enabled)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(
                  `> ${types.formats.no} You cannot set the logging channel because logging by Rift is disabled in this server.`
                ),
            ],
            ephemeral: true,
          });

        const Reply = new EmbedBuilder()
          .setColor(Colors.Red)
          .setDescription(
            `> Set the logging channel for this server by Rift to ${
              channel || `\`Failed to fetch\``
            }?`
          )
          .setAuthor({
            iconURL: member.user.avatarURL(),
            name: member.user.username + "#" + member.user.discriminator,
          })
          .setThumbnail(`${guild.iconURL()}`);

        const Row = new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setLabel("Confirm")
            .setStyle(ButtonStyle.Success)
            .setCustomId(`logs.channel.${channel.id}`),
          new ButtonBuilder()
            .setCustomId("exit")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({ embeds: [Reply], components: [Row] });
        return client.cache.set(
          (await interaction.fetchReply()).id,
          member.user.id
        );
      }
    }
  },
};
