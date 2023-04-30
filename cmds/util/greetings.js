const { EmbedBuilder, ActionRowBuilder } = require("@discordjs/builders");
const {
  ChatInputCommandInteraction,
  Client,
  Colors,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { icons } = require("../../icons/urls");
const { storage } = require("../../schemas/guild");
const { types } = require("../../types/types");

module.exports = {
  name: "greetings",
  description: "Manages Rift's greeting module in this server.",
  permission: "ManageGuild",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const server = await storage.findOne({ guild: interaction.guild.id });

    let GreetingStyle = null;
    if (server.greeting.style === "dm") {
      GreetingStyle = "by **DM**";
    } else {
      GreetingStyle = `by **server channel**\n> Channel: ${`<#${server.greeting.channel}>`.replace(
        "<#null>",
        "None set"
      )}`;
    }

    const Menu = new EmbedBuilder()
      .setColor(Colors.Grey)
      .setThumbnail(icons.greetingsMenu)
      .setTitle("Rift | Greetings")
      .setAuthor({
        name: interaction.user.username + "#" + interaction.user.discriminator,
        iconURL: interaction.user.avatarURL(),
      })
      .setDescription(
        `Fairly simple.\nConfigure the welcome/goodbye messages for this guild.\nConfigure the join / leave staff logs for this guild.\n\n> Greetings: ${
          server.greeting.enabled ? types.formats.yes : types.formats.no
        }\n> Type: ${GreetingStyle}.`
      );

    const Row = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setLabel(server.greeting.enabled ? "Disable" : "Enable")
        .setStyle(
          server.greeting.enabled ? ButtonStyle.Danger : ButtonStyle.Success
        )
        .setCustomId(`greetings.toggle.${interaction.guild.id}`),
      new ButtonBuilder()
        .setLabel("Switch Greeting Style")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(`greetings.style.${interaction.guild.id}`),
      new ButtonBuilder()
        .setLabel("Set Greeting Channel")
        .setCustomId(`greetings.channel.${interaction.user.id}`)
        .setDisabled(server.greeting.style === "dm" ? true : false)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("exit")
        .setLabel("Exit")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({ embeds: [Menu], components: [Row] });

    return client.cache.set(
      (await interaction.fetchReply()).id,
      interaction.user.id
    );
  },
};
