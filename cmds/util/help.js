const { EmbedBuilder } = require("@discordjs/builders");
const {
  ChatInputCommandInteraction,
  Client,
  Colors,
  ApplicationCommandOptionType,
} = require("discord.js");
const { loadFiles } = require("../../functions/loadFiles");
const { icons } = require("../../icons/urls");
module.exports = {
  name: "help",
  description: "Gets information about every command.",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const Files = await loadFiles("cmds");
    const Help = [];

    Files.forEach((file) => {
      const cmd = require(file);

      Help.push(`**${cmd.name}** | ${cmd.description}`);
    });
    const Reply = new EmbedBuilder()
      .setColor(Colors.White)
      .setTitle(`${client.user.username} | Help`)
      .setFields({ name: "Commands:", value: Help.join(`\n`).toString() })
      .setThumbnail(icons.help)
      .setAuthor({
        iconURL: interaction.user.avatarURL(),
        name: interaction.user.username + "#" + interaction.user.discriminator,
      });

    return interaction.reply({ embeds: [Reply], ephemeral: true });
  },
};
