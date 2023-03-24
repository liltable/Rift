const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("@discordjs/builders");
const {
  ButtonInteraction,
  Client,
  Embed,
  Colors,
  ButtonStyle,
} = require("discord.js");
const icons = require("../../icons/urls");
const { storage } = require("../../schemas/guild");
const { types } = require("../../types/types");

module.exports = {
  name: "interactionCreate",
  function: "logs",
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("logs")) return;
    const args = interaction.customId.split(".");
    const { member, guild } = interaction;
    const type = args[1];
    const server = await storage.findOne({ guild: guild.id });
    switch (type) {
      case "toggle": {
        server.logs.enabled = server.logs.enabled ? false : true;
        await server.save();
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(server.logs.enabled ? Colors.Green : Colors.Red)
              .setAuthor({
                iconURL: member.user.avatarURL(),
                name: member.user.username + "#" + member.user.discriminator,
              })
              .setThumbnail(
                `${server.logs.enabled ? icons.create : icons.delete}`
              )
              .setDescription(
                `> ${
                  server.logs.enabled ? types.formats.yes : types.formats.no
                } ${
                  server.logs.enabled ? "Enabled" : "Disabled"
                } logging by Rift for this guild.`
              ),
          ],
          components: [
            new ActionRowBuilder().setComponents(
              new ButtonBuilder()
                .setCustomId("logs.toggle")
                .setLabel("Revoke")
                .setStyle(ButtonStyle.Danger),
              new ButtonBuilder()
                .setCustomId("exit")
                .setLabel("Exit")
                .setStyle(ButtonStyle.Danger)
            ),
          ],
        });

        return client.cache.set(
          (await interaction.fetchReply()).id,
          member.user.id
        );
      }
      case "channel": {
        const channel = guild.channels.cache.get(args[2]);
        if (!channel || !args[2]) {
          server.logs.channel = null;
          await server.save();
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`> :no_entry_sign: Invalid/Lost channel.`),
            ],
            ephemeral: true,
          });
        }
        server.logs.channel = channel.id;
        await server.save();

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Gold)
              .setDescription(
                `> Set the channel for logging by Rift to ${channel} (${channel.id}).`
              )
              .setAuthor({
                name: member.user.username + "#" + member.user.discriminator,
                iconURL: member.user.avatarURL(),
              })
              .setThumbnail(`${icons.create}`),
          ],
          components: [
            new ActionRowBuilder().setComponents(
              new ButtonBuilder().setCustomId(`logs.channel.${null}`)
            ),
          ],
        });

        return client.cache.set(
          (await interaction.fetchReply()).id,
          member.user.id
        );
      }
    }
  },
};
