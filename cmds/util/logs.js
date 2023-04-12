const { EmbedBuilder } = require("@discordjs/builders");
const {
  ChatInputCommandInteraction,
  Client,
  ApplicationCommandOptionType,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");

const { storage } = require("../../schemas/guild");
const { types } = require("../../types/types");
const { icons } = require("../../icons/urls");

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
    {
      name: "view",
      description:
        "View the current settings for logging by Rift in this server.",
      type: ApplicationCommandOptionType.Subcommand,
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
      case "channel":
        {
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
        break;
      case "view": {
        if (!member.permissions.has(PermissionFlagsBits[this.permission])) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(
                  `> :no_entry_sign: Missing permissions: \`${this.permission}\``
                ),
            ],
            ephemeral: true,
          });
        }

        const Embed = new EmbedBuilder()
          .setColor(server.logs.enabled ? Colors.Green : Colors.Red)
          .setThumbnail(icons.logs)
          .setTitle("Rift | Logs")
          .setAuthor({
            name: member.user.username + "#" + member.user.discriminator,
            iconURL: member.user.avatarURL(),
          })
          .setDescription(
            `Logging status:\n\n> Enabled: ${
              server.logs.enabled ? types.formats.yes : types.formats.no
            }\n> Channel: ${
              server.logs.channel
                ? `<#${server.logs.channel}>`
                : "No channel set."
            }`
          );

        return interaction.reply({ embeds: [Embed] });
      }
    }
  },
};
