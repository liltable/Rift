const { EmbedBuilder } = require("@discordjs/builders");
const { ChatInputCommandInteraction, Client, Colors } = require("discord.js");
const { loadFiles } = require("../../functions/loadFiles");
module.exports = {
  name: "help",
  description: "Gets information about every command.",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const Help = (await loadFiles("cmds")).map(
      (file) => `**${require(file).name}** | ${require(file).description}`
    );

    const Reply = new EmbedBuilder()
      .setColor(Colors.White)
      .setTitle(`${client.user.username} | Help`)
      .setDescription(
        `This is every command ${client.user.username} has and it's description.`
      )
      .setFields({
        name: "Commands:",
        value: "> " + Help.join(`\n> `).toString(),
      });

    return interaction.reply({ embeds: [Reply], ephemeral: true });
  },
};
