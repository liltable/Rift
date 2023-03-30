const {
  ButtonInteraction,
  Client,
  EmbedBuilder,
  Colors,
} = require("discord.js");
const icons = require("../../icons/urls");
const { storage } = require("../../schemas/guild");
const { logs } = require("../../types/logs");
const { types } = require("../../types/types");

module.exports = {
  name: "interactionCreate",
  function: "kick",
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("kick")) return;
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
    const { member, guild } = interaction;
    const args = interaction.customId.split(".");
    const target = await guild.members.fetch(args[1]);
    const reason = args[2];

    await logs.kick(
      target,
      member,
      reason,
      guild,
      parseInt(interaction.createdTimestamp / 1000)
    );

    await target.kick({ reason: reason });

    const Reply = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({
        iconURL: target.user.avatarURL(),
        name: target.user.username + "#" + target.user.discriminator,
      })
      .setDescription(`> Kicked ${target} for **${reason}**.`);

    await interaction.reply({ embeds: [Reply] });

    setTimeout(async () => {
      const msg = await interaction.fetchReply();
      if (msg && msg.deletable) {
        await msg.delete();
      }
    }, ms("10s"));
  },
};
