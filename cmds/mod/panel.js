const { EmbedBuilder } = require("@discordjs/builders");
const {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  Client,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { storage } = require("../../schemas/guild");

module.exports = {
  name: "panel",
  description: "Opens the Rift panel.",
  permission: "ManageGuild" || "Administrator",
  options: [
    {
      name: "menu",
      description: "Select a specific menu to enter.",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "Logs",
          value: "logs",
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
    const { member, options, guild } = interaction;
    const checkForMenu = options.getString("menu") ? true : false;
    const Timestamp = parseInt(interaction.createdTimestamp / 1000);

    const server = await storage.findOne({ guild: guild.id });
    if (!server) {
      var serverDisplayInfo = `> *This server has not activated Rift.*`;
    } else {
      var serverDisplayInfo = `> Logging: ${
        server.logs.enabled ? `:white_check_mark:` : `:no_entry_sign:`
      }`;
    }

    if (checkForMenu) {
      switch (options.getString("menu", true)) {
        case "logs":
          {
            const Buttons = {
              Enable: new ButtonBuilder()
                .setCustomId("logs.enable")
                .setLabel("Enable")
                .setStyle(ButtonStyle.Success),
              Disable: new ButtonBuilder()
                .setCustomId("logs.disable")
                .setLabel("Disable")
                .setStyle(ButtonStyle.Danger),
              Set: new ButtonBuilder()
                .setCustomId("logs.set")
                .setLabel("Set")
                .setStyle(ButtonStyle.Primary),
            };
            const Logs = new EmbedBuilder();
            Buttons.Enable.setDisabled(server.logs.enabled ? false : true);
            Buttons.Disable.setDisabled(server.logs.enabled ? true : false);
            Logs.setColor(server.logs.enabled ? Colors.Green : Colors.Red)
              .setTitle(`${guild.name} | Logs`)
              .setAuthor({
                iconURL: member.user.avatarURL(),
                name: member.user.username + "#" + member.user.discriminator,
              })
              .setThumbnail(`${guild.iconURL()}`);
            const Description = [
              `> Logging is **${
                server.logs.enabled ? "enabled" : "not enabled"
              }** in this server.`,
            ];
            const logChannel = guild.channels.cache.get(server.logs.channel)
              ? true
              : false;
            if (logChannel) {
              Description.push(
                `The log channel is currently set to: ${
                  guild.channels.cache.get(server.logs.channel) ||
                  `\`Failed to fetch.\``
                } (${server.logs.channel || `\`-\``})`
              );
            } else {
              Description.push(
                `The log channel isn't set to any channels in this guild.`
              );
            }

            await interaction.reply({ embeds: [Logs], components: [Row] });
            return client.cache.set(
              (await interaction.fetchReply()).id,
              member.user.id
            );
          }
          break;
      }
    } else {
      const Menu = new EmbedBuilder()
        .setTitle(`${guild.name} | Menu`)
        .setThumbnail(`${guild.iconURL()}`)
        .setAuthor({
          iconURL: member.user.avatarURL(),
          name: member.user.username + "#" + member.user.discriminator,
        })
        .setDescription(
          `Welcome to the Rift panel for this server.\nHere you can manage every module Rift has for this server.\n\n${serverDisplayInfo}`
        );

      const Row = new ActionRowBuilder().setComponents(
        new ButtonBuilder()
          .setCustomId("logs")
          .setLabel("Logs")
          .setStyle(
            server.logs.enabled ? ButtonStyle.Success : ButtonStyle.Danger
          )
      );
      await interaction.reply({ embeds: [Menu], components: [Row] });
      return client.cache.set(
        (await interaction.fetchReply()).id,
        member.user.id
      );
    }
  },
};
